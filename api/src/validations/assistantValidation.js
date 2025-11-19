import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/APIError'

const validateAIRequest = async (req, res, next) => {
    const schema = Joi.object({
        userId: Joi.string().required(),
        messages: Joi.array().items(
            Joi.object({
                role: Joi.string().valid('user', 'assistant').required(),
                content: Joi.string().required()
            })
        ).min(1).required()
    })

    try {
        await schema.validateAsync(req.body, { abortEarly: false })
        // console.log("Assistant request validation passed: ", req.body);
        next()
    } catch (error) {
        const errorMessage = new Error(error).message
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
        next(customError)
    }
}

export const assistantValidation = {
    validateAIRequest
}