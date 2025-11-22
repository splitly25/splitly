import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/APIError.js'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    groupName: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500).optional().allow(''),
    members: Joi.array().items(Joi.string()).min(1).optional(),
    avatar: Joi.string().uri().optional().allow(null).allow(''),
  })

  try {
    // console.log('Request body: ', req.body)

    await correctCondition.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const fetchGroups = async (req, res, next) => {
  const correctCondition = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().allow('').optional(),
  })

  try {
    await correctCondition.validateAsync(req.query, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    groupName: Joi.string().min(1).max(100).optional(),
    description: Joi.string().max(500).optional().allow(''),
    members: Joi.array().items(Joi.string()).min(1).optional(),
    avatar: Joi.string().uri().optional().allow(null).allow(''),
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const groupValidation = {
  createNew,
  fetchGroups,
  update,
}
