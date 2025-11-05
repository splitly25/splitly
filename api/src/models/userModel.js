import Joi from 'joi'
import { GET_DB } from '~/config/mongodb.js'
import { ObjectId } from 'mongodb'

// Collection name
const USER_COLLECTION_NAME = 'users'

// Import activity model for logging (avoid circular dependency by lazy loading)
let activityModel = null
const getActivityModel = async () => {
  if (!activityModel) {
    const { activityModel: am } = await import('./activityModel.js')
    activityModel = am
  }
  return activityModel
}
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

const createNew = async (data, options = {}) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newUserToAdd = {
      ...validData,
      createdAt: Date.now()
    }
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(newUserToAdd)
    
    // Log activity if enabled
    if (options.logActivity !== false) {
      try {
        const am = await getActivityModel()
        await am.logUserActivity(
          am.ACTIVITY_TYPES.USER_CREATED,
          createdUser.insertedId.toString(),
          createdUser.insertedId.toString(),
          {
            userEmail: validData.email,
            userName: validData.name,
            ipAddress: options.ipAddress,
            userAgent: options.userAgent,
            description: `New user account created: ${validData.email}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log user creation activity:', activityError.message)
      }
    }
    
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

const update = async (userId, updateData, options = {}) => {
  try {
    // Filter out invalid fields
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    // Get original user data for activity logging
    let originalUser = null
    if (options.logActivity !== false && options.updatedBy) {
      originalUser = await findOneById(userId)
    }

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { ...updateData, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )

    // Log activity if enabled
    if (options.logActivity !== false && options.updatedBy && originalUser) {
      try {
        const am = await getActivityModel()
        await am.logUserActivity(
          am.ACTIVITY_TYPES.USER_UPDATED,
          options.updatedBy,
          userId,
          {
            userEmail: originalUser.email,
            userName: originalUser.name,
            previousValue: {
              name: originalUser.name,
              phone: originalUser.phone,
              avatar: originalUser.avatar
            },
            newValue: updateData,
            description: `Updated user profile: ${originalUser.email}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log user update activity:', activityError.message)
      }
    }

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
 * @param {Object} options - Options for logging and metadata
 * @returns {Promise<Object>} User object
 */
const findOrCreateUserByEmail = async (email, options = {}) => {
  try {
    const normalizedEmail = email.toLowerCase().trim()
    let user = await findOneByEmail(normalizedEmail)
    
    if (!user) {
      // Extract name from email (everything before '@')
      const name = normalizedEmail.split('@')[0]
      const result = await createNew({
        email: normalizedEmail,
        name: name
      }, { 
        logActivity: options.logActivity, 
        ipAddress: options.ipAddress,
        userAgent: options.userAgent 
      })
      user = await findOneById(result.insertedId)
    }
    
    return user
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Log user login activity
 * @param {string} userId - User ID
 * @param {Object} loginDetails - Login details (IP, user agent, etc.)
 * @returns {Promise<void>}
 */
const logLogin = async (userId, loginDetails = {}) => {
  try {
    const user = await findOneById(userId)
    if (!user) return
    
    const am = await getActivityModel()
    await am.logUserActivity(
      am.ACTIVITY_TYPES.USER_LOGIN,
      userId,
      userId,
      {
        userEmail: user.email,
        userName: user.name,
        ipAddress: loginDetails.ipAddress,
        userAgent: loginDetails.userAgent,
        description: `User logged in: ${user.email}`
      }
    )
  } catch (error) {
    console.warn('Failed to log user login activity:', error.message)
  }
}

/**
 * Log user logout activity
 * @param {string} userId - User ID
 * @param {Object} logoutDetails - Logout details (IP, user agent, etc.)
 * @returns {Promise<void>}
 */
const logLogout = async (userId, logoutDetails = {}) => {
  try {
    const user = await findOneById(userId)
    if (!user) return
    
    const am = await getActivityModel()
    await am.logUserActivity(
      am.ACTIVITY_TYPES.USER_LOGOUT,
      userId,
      userId,
      {
        userEmail: user.email,
        userName: user.name,
        ipAddress: logoutDetails.ipAddress,
        userAgent: logoutDetails.userAgent,
        description: `User logged out: ${user.email}`
      }
    )
  } catch (error) {
    console.warn('Failed to log user logout activity:', error.message)
  }
}

/**
 * Find multiple users by an array of IDs
 * @param {Array<string>} userIds - Array of user ID strings
 * @returns {Promise<Array>} - Array of user documents
 */
const findManyByIds = async (userIds) => {
  try {
    // Chuyển mảng string IDs thành mảng ObjectId
    const objectIds = userIds.map(id => new ObjectId(id))
    
    // Tìm tất cả user có _id nằm trong mảng objectIds
    const users = await GET_DB()
      .collection(USER_COLLECTION_NAME) // <-- Đảm bảo tên collection này là đúng
      .find({
        _id: { $in: objectIds }
      })
      .toArray()
      
    return users
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findManyByIds,
  findOneByEmail,
  getAll,
  update,
  deleteOneById,
  findOrCreateUserByEmail,
  logLogin,
  logLogout
}
