import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/APIError'

const getUserDebts = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string().required()
  })

  try {
    await correctCondition.validateAsync(req.params, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

const initiatePayment = async (req, res, next) => {
  const correctCondition = Joi.object({
    creditorId: Joi.string().required(),
    amount: Joi.number().positive().required(),
    note: Joi.string().allow('').optional()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}

export const debtValidation = {
  getUserDebts,
  initiatePayment
}
