/**
 * User Model
 * Manages user information in the Spitly application
 */

import Joi from 'joi'
import { GET_DB } from '~/config/mongodb.js'
import { ObjectId } from 'mongodb'

// Collection name
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  name: Joi.string().required().trim().min(2).max(100),
  avatar: Joi.string().uri().default(null),
  phone: Joi.string().pattern(/^[0-9]{10,11}$/).default(null),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})

// Fields that should not be updated after creation
const INVALID_UPDATE_FIELDS = ['_id', 'email', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newUserToAdd = {
      ...validData,
      createdAt: Date.now()
    }
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(newUserToAdd)
    return createdUser
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (userId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(userId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: email.toLowerCase().trim()
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async () => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({ _destroy: false })
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (userId, updateData) => {
  try {
    // Filter out invalid fields
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { ...updateData, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (userId) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(userId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Find user by email, or create if not exists
 * If email not found, creates a new user with name extracted from email (before '@')
 * @param {string} email - User email address
 * @returns {Promise<Object>} User object
 */
const findOrCreateUserByEmail = async (email) => {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    let user = await findOneByEmail(normalizedEmail)
    
    if (!user) {
      // Extract name from email (everything before '@')
      const name = normalizedEmail.split('@')[0]
      const result = await createNew({
        email: normalizedEmail,
        name: name
      })
      user = await findOneById(result.insertedId)
    }
    
    return user
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByEmail,
  getAll,
  update,
  deleteOneById,
  findOrCreateUserByEmail
}
