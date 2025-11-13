/**
 * Payment Confirmation Model
 * Tracks used payment confirmation tokens to prevent reuse
 */

import Joi from 'joi'
import { GET_DB } from '~/config/mongodb.js'
import { ObjectId } from 'mongodb'

const PAYMENT_CONFIRMATION_COLLECTION_NAME = 'payment_confirmations'

const PAYMENT_CONFIRMATION_SCHEMA = Joi.object({
  paymentId: Joi.alternatives().try(Joi.string(), Joi.object().instance(ObjectId)).required(),
  token: Joi.string().required(),
  recipientId: Joi.alternatives().try(Joi.string(), Joi.object().instance(ObjectId)).required(),
  payerId: Joi.alternatives().try(Joi.string(), Joi.object().instance(ObjectId)).required(),
  amount: Joi.number().required(),
  isConfirmed: Joi.boolean().required(), // true = confirmed, false = rejected
  confirmedAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})

/**
 * Create a new payment confirmation record
 */
const createNew = async (data) => {
  try {
    const validData = await PAYMENT_CONFIRMATION_SCHEMA.validateAsync(data, { abortEarly: false })
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
      .findOne({ paymentId, _destroy: false })
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
