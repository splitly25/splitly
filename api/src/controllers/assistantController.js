import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/APIError.js";
import { ObjectId } from 'mongodb'
import { userModel } from '~/models/index.js'
import { ClovaXClient } from "~/providers/ClovaStudioProvider.js";
import { allTools } from "~/utils/tools.js";
import { navigateBillCreateForm } from "~/utils/assistantHelpers";

const processAIRequest = async (req, res, next) => {
    try {
        const { userId, messages } = req.body;
        const userIdObj = new ObjectId(userId);
        const user = await userModel.findOneById(userIdObj);
        let navigation = null;

        if (!user) {
            const errorMessage = `User with ID ${userId} not found.`;
            const customError = new ApiError(StatusCodes.NOT_FOUND, errorMessage);
            return next(customError);
        }

        const client = new ClovaXClient();

        if (messages.length === 0 || messages[0].role !== "system") {
            messages.unshift({
                role: "system",
                content: "You are TingTing, a helpful assistant for managing shared expense bills. When users ask you to create a new bill, use the create_new_bill tool to generate the bill based on the information they provide. Provide concise results for the bills you create. Always maintain a positive, friendly, and sociable attitude. All of your responses must always be in Vietnamese plain text.",
            });
        }

        console.log("ClovaX Request Messages:", JSON.stringify(messages, null, 2));

        const request = client.createRequest(messages, allTools);
        const response = await client.createChatCompletion(request);
        const assistantMessage = response.result.message;

        console.log("ClovaX Response:", JSON.stringify(response, null, 2));

        if (
            response.result.finishReason === "tool_calls" &&
            assistantMessage.toolCalls &&
            assistantMessage.toolCalls.length > 0
        ) {
            console.log("Tool calls detected:", JSON.stringify(assistantMessage.toolCalls, null, 2));

            // Execute all tool calls
            for (const toolCall of assistantMessage.toolCalls) {
                const args = toolCall.function.arguments;
                try {
                    if (toolCall.function.name === "create_new_bill") {
                        navigation = navigateBillCreateForm(args)
                        messages.push({
                            role: "tool",
                            content: `Điền thông tin vào hóa đơn thành công:\n ${JSON.stringify(args, null, 2)}`,
                            toolCallId: toolCall.id,
                        });
                    } else {
                        console.log("tool call: ", toolCall.function.name)
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
                    console.error("Error: ", error);
                    messages.push({
                        role: "tool",
                        content: `Error: ${errorMessage}`,
                        toolCallId: toolCall.id,
                    });
                }
            }
        }

        const finalRequest = {
            ...client.createRequest(messages),
            maxTokens: 1000,
        };
        const finalResponse = await client.createChatCompletion(finalRequest);



        res.status(StatusCodes.OK).json({ response: finalResponse.result.message, navigation: navigation });
    } catch (error) {
        const errorMessage = new Error(error).message;
        const customError = new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
        next(customError);
    }
};

export const assistantController = {
    processAIRequest
};