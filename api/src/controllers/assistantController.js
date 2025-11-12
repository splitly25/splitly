import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/APIError.js";
import { findOneById } from "~/services/userService.js";
import { ClovaXClient } from "~/providers/ClovaStudioProvider.js";

const processAIRequest = async (req, res, next) => {
    try {
        const { userId, messages } = req.body;
        const user = await findOneById(userId);
        if (!user) {
            const errorMessage = `User with ID ${userId} not found.`;
            const customError = new ApiError(StatusCodes.NOT_FOUND, errorMessage);
            return next(customError);
        }

        const client = new ClovaXClient();

        
        res.status(StatusCodes.OK).json({ response: aiResponse });
    } catch (error) {
        const errorMessage = new Error(error).message;
        const customError = new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
        next(customError);
    }
};

export const assistantController = {
    processAIRequest
};