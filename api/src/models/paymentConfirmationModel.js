/**
 * Payment Confirmation Model
 * Tracks used payment confirmation tokens to prevent reuse
 */

import Joi from 'joi'
import { GET_DB } from '~/config/mongodb.js'
import { ObjectId } from 'mongodb'

const PAYMENT_CONFIRMATION_COLLECTION_NAME = 'payment_confirmations'

const PAYMENT_CONFIRMATION_SCHEMA = Joi.object({
  paymentId: Joi.object().instance(ObjectId).required(),
  token: Joi.string().required(),
  recipientId: Joi.object().instance(ObjectId).required(),
  payerId: Joi.object().instance(ObjectId).required(),
  amount: Joi.number().required(),
  isConfirmed: Joi.boolean().required(), // true = confirmed, false = rejected
  confirmedAt: Joi.date().timestamp('javascript').default(Date.now),
  priorityBill: Joi.string().optional().allow(null),
  _destroy: Joi.boolean().default(false)
})

/**
 * Convert string IDs to ObjectId for consistency
 */
const convertIdsToObjectId = (data) => {
  const converted = { ...data }
  
  // Convert paymentId
  if (converted.paymentId && typeof converted.paymentId === 'string' && ObjectId.isValid(converted.paymentId)) {
    converted.paymentId = new ObjectId(converted.paymentId)
  }
  
  // Convert recipientId
  if (converted.recipientId && typeof converted.recipientId === 'string' && ObjectId.isValid(converted.recipientId)) {
    converted.recipientId = new ObjectId(converted.recipientId)
  }
  
  // Convert payerId
  if (converted.payerId && typeof converted.payerId === 'string' && ObjectId.isValid(converted.payerId)) {
    converted.payerId = new ObjectId(converted.payerId)
  }
  
  return converted
}

/**
 * Create a new payment confirmation record
 */
const createNew = async (data) => {
  try {
    const convertedData = convertIdsToObjectId(data)
    const validData = await PAYMENT_CONFIRMATION_SCHEMA.validateAsync(convertedData, { abortEarly: false })
    const result = await GET_DB().collection(PAYMENT_CONFIRMATION_COLLECTION_NAME).insertOne({
      ...validData,
      confirmedAt: Date.now()
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Find a payment confirmation by token
 */
const findByToken = async (token) => {
  try {
    const result = await GET_DB()
      .collection(PAYMENT_CONFIRMATION_COLLECTION_NAME)
      .findOne({ token, _destroy: false })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Find a payment confirmation by paymentId
 */
const findByPaymentId = async (paymentId) => {
  try {
    const result = await GET_DB()
      .collection(PAYMENT_CONFIRMATION_COLLECTION_NAME)
      .findOne({ paymentId: new ObjectId(paymentId), _destroy: false })
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
    return !!result
  } catch (error) {
    throw new Error(error)
  }
}

export const paymentConfirmationModel = {
  PAYMENT_CONFIRMATION_COLLECTION_NAME,
  PAYMENT_CONFIRMATION_SCHEMA,
  createNew,
  findByToken,
  findByPaymentId,
  isTokenUsed
}
