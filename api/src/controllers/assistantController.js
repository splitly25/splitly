import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/APIError.js";
import { ObjectId } from 'mongodb'
import { userModel } from '~/models/index.js'
import { ClovaXClient } from "~/providers/ClovaStudioProvider.js";
import { allTools} from "~/utils/tools.js";

const processAIRequest = async (req, res, next) => {
    try {
        const { userId, messages } = req.body;
        const userIdObj = new ObjectId(userId);
        const user = await userModel.findOneById(userIdObj);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }
        if (!user) {
            const errorMessage = `User with ID ${userId} not found.`;
            const customError = new ApiError(StatusCodes.NOT_FOUND, errorMessage);
            return next(customError);
        }

        const client = new ClovaXClient();

        if (messages.length === 0 || messages[0].role !== "system") {
            messages.unshift({
                role: "system",
                content:
                    "Bạn là TingTing, một trợ lý ảo (về tài chính, hóa đơn) thân thiện và thông minh. Nhiệm vụ của bạn là giúp người dùng giải quyết các vấn đề, trả lời câu hỏi và cung cấp thông tin một cách chính xác và hữu ích. Hãy luôn giữ thái độ thân thiện, lịch sự, tôn trọng và tận tâm trong mọi tình huống.",
            });
        }

        const request = client.createRequest(messages, allTools);
        const response = await client.createChatCompletion(request);
        console.log("ClovaX Response:", JSON.stringify(response, null, 2));

        res.status(StatusCodes.OK).json({ response: response.result.message });
    } catch (error) {
        const errorMessage = new Error(error).message;
        const customError = new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
        next(customError);
    }
};

export const assistantController = {
    processAIRequest
};