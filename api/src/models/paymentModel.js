/**
 * Payment Model
 * Tracks payment reminder tokens for debtors to pay creditors
 */

import Joi from 'joi'
import { GET_DB } from '~/config/mongodb.js'
import { ObjectId } from 'mongodb'

const PAYMENT_COLLECTION_NAME = 'payment_reminders'

const PAYMENT_SCHEMA = Joi.object({
  token: Joi.string().required(),
  creditorId: Joi.object().instance(ObjectId).required(),
  debtorId: Joi.object().instance(ObjectId).required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  usedAt: Joi.date().timestamp('javascript').optional(),
  _destroy: Joi.boolean().default(false)
})

/**
 * Convert string IDs to ObjectId for consistency
 */
const convertIdsToObjectId = (data) => {
  const converted = { ...data }

  // Convert creditorId
  if (converted.creditorId && typeof converted.creditorId === 'string' && ObjectId.isValid(converted.creditorId)) {
    converted.creditorId = new ObjectId(converted.creditorId)
  }

  // Convert debtorId
  if (converted.debtorId && typeof converted.debtorId === 'string' && ObjectId.isValid(converted.debtorId)) {
    converted.debtorId = new ObjectId(converted.debtorId)
  }

  return converted
}

/**
 * Create a new payment reminder record
 */
const createNew = async (data) => {
  try {
    const convertedData = convertIdsToObjectId(data)
    const validData = await PAYMENT_SCHEMA.validateAsync(convertedData, { abortEarly: false })
    const result = await GET_DB().collection(PAYMENT_COLLECTION_NAME).insertOne({
      ...validData,
      createdAt: Date.now()
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Find a payment reminder by token
 */
const findByToken = async (token) => {
  try {
    const result = await GET_DB()
      .collection(PAYMENT_COLLECTION_NAME)
      .findOne({ token, _destroy: false })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Mark reminder as used
 */
const markAsUsed = async (token) => {
  try {
    const result = await GET_DB()
      .collection(PAYMENT_COLLECTION_NAME)
      .updateOne(
        { token, _destroy: false },
        { $set: { usedAt: Date.now() } }
      )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Check if a token has been used
 */
const isTokenUsed = async (token) => {
  try {
    const result = await findByToken(token)
    return result && result.usedAt
  } catch (error) {
    throw new Error(error)
  }
}

export const paymentModel = {
  PAYMENT_COLLECTION_NAME,
  PAYMENT_SCHEMA,
  createNew,
  findByToken,
  markAsUsed,
  isTokenUsed
}