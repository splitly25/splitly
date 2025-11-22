import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/APIError.js";
import { ObjectId } from 'mongodb'
import { userModel } from '~/models/index.js'
import { ClovaXClient } from "~/providers/ClovaStudioProvider.js";
import { allTools, categorizeRequestTool } from "~/utils/tools.js";
import { navigateBillCreateForm, getNewPrompt, analysisByAssistant, suggestPayers } from "~/utils/assistantHelpers";

const processAIRequest = async (req, res, next) => {
    try {
        let { userId, messages } = req.body;
        const userIdObj = new ObjectId(userId);
        const user = await userModel.findOneById(userIdObj);
        let navigation = null;
        let assistantResponse = null;
        let tools = allTools;

        if (!user) {
            const errorMessage = `User with ID ${userId} not found.`;
            const customError = new ApiError(StatusCodes.NOT_FOUND, errorMessage);
            return next(customError);
        }

        const client = new ClovaXClient();

        if (messages.length === 0 || messages[0].role !== "system") {
            messages.unshift({
                role: "system",
                content: "You are TingTing, a helpful assistant for managing shared expense bills. Whenever you receive any message from the user, you must use the categorize_request tool to categorize the user's request before performing any further actions.",
            });
            tools = [ categorizeRequestTool ];
        }

        while (assistantResponse === null || assistantResponse.result.finishReason === "tool_calls") {
            console.log("ClovaX Request Messages:", JSON.stringify(messages, null, 2));
            const request = client.createRequest(messages, tools);
            // console.log("ClovaX Request:", JSON.stringify(request, null, 2));
            try {
                assistantResponse = await client.createChatCompletion(request);
            } catch (error) {
                console.error("Error during ClovaX API call:", error);
                throw error;
            }
            const assistantMessage = assistantResponse.result.message;

            console.log("ClovaX Response:", JSON.stringify(assistantResponse, null, 2));

            if (
                assistantResponse.result.finishReason === "tool_calls" &&
                assistantMessage.toolCalls &&
                assistantMessage.toolCalls.length > 0
            ) {
                console.log("Tool calls detected:", JSON.stringify(assistantMessage.toolCalls, null, 2));
                // Execute all tool calls
                for (const toolCall of assistantMessage.toolCalls) {
                    const args = toolCall.function.arguments;
                    try {
                        if (toolCall.function.name === "categorize_request") {
                            const newPrompt = getNewPrompt(args);
                            console.log("New Prompt:", newPrompt);
                            if (newPrompt) {
                                messages[0] = {
                                    role: "system",
                                    content: newPrompt,
                                };
                                messages.push({
                                    role: "tool",
                                    content: `Yêu cầu đã được phân loại là: ${args.requestType}.`,
                                    toolCallId: toolCall.id,
                                });
                            } else {
                                messages.push({
                                    role: "tool",
                                    content: `Lỗi: Loại yêu cầu không xác định - ${args.categorized_request}`,
                                    toolCallId: toolCall.id,
                                });
                            }
                        } else if (toolCall.function.name === "create_new_bill") {
                            navigation = navigateBillCreateForm(args)
                            messages.push({
                                role: "tool",
                                content: `Điền thông tin vào hóa đơn thành công:\n ${JSON.stringify(args, null, 2)}`,
                                toolCallId: toolCall.id,
                            });
                        } else if (toolCall.function.name === "search_participants_by_key") {
                            const users = await userModel.findManyByKeys(args.keys);
                            messages.push({
                                role: "tool",
                                content: `Kết quả tìm kiếm người dùng:\n ${JSON.stringify(users, null, 2)}`,
                                toolCallId: toolCall.id,
                            });
                        } else if (toolCall.function.name === "get_current_user") {
                            messages.push({
                                role: "tool",
                                content: `Thông tin người dùng hiện tại:\n ${JSON.stringify(user, null, 2)}`,
                                toolCallId: toolCall.id,
                            });
                        } else if (toolCall.function.name === "analysis_by_assistant") {
                            const analysisResult = await analysisByAssistant(userId);
                            console.log("Analysis Result:", analysisResult);
                            messages.push({
                                role: "tool",
                                content: `Kết quả phân tích:\n ${JSON.stringify(analysisResult, null, 2)}`,
                                toolCallId: toolCall.id,
                            });
                        } else if (toolCall.function.name === "suggest_payers") {
                            const payersSuggestion = await suggestPayers(userId);
                            console.log("Payers Suggestion:", payersSuggestion);
                            messages.push({
                                role: "tool",
                                content: `Gợi ý người thanh toán:\n ${JSON.stringify(payersSuggestion, null, 2)}`,
                                toolCallId: toolCall.id,
                            });
                        }
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
                        console.error("Error: ", error);
                        messages.push({
                            role: "tool",
                            content: `Error: ${errorMessage}`,
                            toolCallId: toolCall.id,
                        });
                    } finally {
                        tools = allTools;
                    }
                }
            }
        }

        const finalRequest = {
            ...client.createRequest(messages),
            maxTokens: 1000,
        };
        const finalResponse = await client.createChatCompletion(finalRequest);
        messages.push(finalResponse.result.message);
        res.status(StatusCodes.OK).json({ messages, navigation: navigation });
    } catch (error) {
        const errorMessage = new Error(error).message;
        const customError = new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
        next(customError);
    }
};

export const assistantController = {
    processAIRequest
};