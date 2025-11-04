/**
 * Activity Model
 * Tracks user activities and events in the Spitly application
 */

import Joi from 'joi'
import { GET_DB } from '~/config/mongodb.js'
import { ObjectId } from 'mongodb'

// Collection name
const ACTIVITY_COLLECTION_NAME = 'activities'

// Activity types enum
const ACTIVITY_TYPES = {
  // Bill activities
  BILL_CREATED: 'bill_created',
  BILL_UPDATED: 'bill_updated',
  BILL_DELETED: 'bill_deleted',
  BILL_PAID: 'bill_paid',
  BILL_SETTLED: 'bill_settled',
  BILL_REMINDER_SENT: 'bill_reminder_sent',
  BILL_USER_OPTED_OUT: 'bill_user_opted_out',
  
  // Group activities
  GROUP_CREATED: 'group_created',
  GROUP_UPDATED: 'group_updated',
  GROUP_DELETED: 'group_deleted',
  GROUP_MEMBER_ADDED: 'group_member_added',
  GROUP_MEMBER_REMOVED: 'group_member_removed',
  GROUP_BILL_ADDED: 'group_bill_added',
  
  // User activities
  USER_CREATED: 'user_created',
  USER_UPDATED: 'user_updated',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout'
}

const ACTIVITY_COLLECTION_SCHEMA = Joi.object({
  activityType: Joi.string().valid(...Object.values(ACTIVITY_TYPES)).required(),
  
  // User who performed the activity
  userId: Joi.string().required(),
  
  // Resource information
  resourceType: Joi.string().valid('bill', 'group', 'user').required(),
  resourceId: Joi.string().required(),
  
  // Activity details and metadata
  details: Joi.object({
    // For bill activities
    billName: Joi.string().optional(),
    amount: Joi.number().optional(),
    paymentStatus: Joi.string().optional(),
    
    // For group activities  
    groupName: Joi.string().optional(),
    memberEmail: Joi.string().email().optional(),
    memberId: Joi.string().optional(),
    
    // For user activities
    userEmail: Joi.string().email().optional(),
    userName: Joi.string().optional(),
    
    // For reminders
    reminderType: Joi.string().valid('email', 'notification', 'sms').optional(),
    recipientId: Joi.string().optional(),
    
    // Previous and new values for updates
    previousValue: Joi.object().optional(),
    newValue: Joi.object().optional(),
    
    // Additional metadata
    ipAddress: Joi.string().ip().optional(),
    userAgent: Joi.string().optional(),
    description: Joi.string().max(500).optional()
  }).default({}),
  
  // Activity timestamp
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  
  // Soft delete flag
  _destroy: Joi.boolean().default(false)
})

// Fields that should not be updated after creation
const INVALID_UPDATE_FIELDS = ['_id', 'userId', 'resourceType', 'resourceId', 'activityType', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await ACTIVITY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

/**
 * Create a new activity record
 * @param {Object} data - Activity data
 * @returns {Promise<Object>} Created activity result
 */
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newActivityToAdd = {
      ...validData,
      createdAt: Date.now()
    }
    const createdActivity = await GET_DB().collection(ACTIVITY_COLLECTION_NAME).insertOne(newActivityToAdd)
    return createdActivity
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Find activity by ID
 * @param {string} activityId - Activity ID
 * @returns {Promise<Object|null>} Activity object or null
 */
const findOneById = async (activityId) => {
  try {
    const result = await GET_DB().collection(ACTIVITY_COLLECTION_NAME).findOne({
      _id: new ObjectId(activityId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Get all activities with pagination
 * @param {number} limit - Number of activities to return
 * @param {number} offset - Number of activities to skip
 * @returns {Promise<Array>} Array of activities
 */
const getAll = async (limit = 100, offset = 0) => {
  try {
    const result = await GET_DB()
      .collection(ACTIVITY_COLLECTION_NAME)
      .find({ _destroy: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Get activities by user ID
 * @param {string} userId - User ID
 * @param {number} limit - Number of activities to return
 * @param {number} offset - Number of activities to skip
 * @returns {Promise<Array>} Array of user activities
 */
const getActivitiesByUser = async (userId, limit = 50, offset = 0) => {
  try {
    const result = await GET_DB()
      .collection(ACTIVITY_COLLECTION_NAME)
      .find({
        userId: userId,
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Get activities by resource (bill, group, user)
 * @param {string} resourceType - Type of resource ('bill', 'group', 'user')
 * @param {string} resourceId - Resource ID
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Array>} Array of resource activities
 */
const getActivitiesByResource = async (resourceType, resourceId, limit = 50) => {
  try {
    const result = await GET_DB()
      .collection(ACTIVITY_COLLECTION_NAME)
      .find({
        resourceType: resourceType,
        resourceId: resourceId,
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Get activities by type
 * @param {string} activityType - Type of activity
 * @param {number} limit - Number of activities to return
 * @param {number} offset - Number of activities to skip
 * @returns {Promise<Array>} Array of activities of specified type
 */
const getActivitiesByType = async (activityType, limit = 50, offset = 0) => {
  try {
    const result = await GET_DB()
      .collection(ACTIVITY_COLLECTION_NAME)
      .find({
        activityType: activityType,
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Get activities within date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Array>} Array of activities in date range
 */
const getActivitiesByDateRange = async (startDate, endDate, limit = 100) => {
  try {
    const result = await GET_DB()
      .collection(ACTIVITY_COLLECTION_NAME)
      .find({
        createdAt: {
          $gte: startDate.getTime(),
          $lte: endDate.getTime()
        },
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Update activity (limited fields)
 * @param {string} activityId - Activity ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated activity
 */
const update = async (activityId, updateData) => {
  try {
    // Filter out invalid fields
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await GET_DB().collection(ACTIVITY_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(activityId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Soft delete activity
 * @param {string} activityId - Activity ID
 * @returns {Promise<Object>} Delete result
 */
const deleteOneById = async (activityId) => {
  try {
    const result = await GET_DB().collection(ACTIVITY_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(activityId) },
      { $set: { _destroy: true } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Helper function to log bill activities
 * @param {string} activityType - Type of activity
 * @param {string} userId - User ID who performed the action
 * @param {string} billId - Bill ID
 * @param {Object} details - Additional details
 * @returns {Promise<Object>} Created activity
 */
const logBillActivity = async (activityType, userId, billId, details = {}) => {
  return await createNew({
    activityType,
    userId,
    resourceType: 'bill',
    resourceId: billId,
    details
  })
}

/**
 * Helper function to log group activities
 * @param {string} activityType - Type of activity
 * @param {string} userId - User ID who performed the action
 * @param {string} groupId - Group ID
 * @param {Object} details - Additional details
 * @returns {Promise<Object>} Created activity
 */
const logGroupActivity = async (activityType, userId, groupId, details = {}) => {
  return await createNew({
    activityType,
    userId,
    resourceType: 'group',
    resourceId: groupId,
    details
  })
}

/**
 * Helper function to log user activities
 * @param {string} activityType - Type of activity
 * @param {string} userId - User ID who performed the action
 * @param {string} targetUserId - Target user ID (can be same as userId)
 * @param {Object} details - Additional details
 * @returns {Promise<Object>} Created activity
 */
const logUserActivity = async (activityType, userId, targetUserId, details = {}) => {
  return await createNew({
    activityType,
    userId,
    resourceType: 'user',
    resourceId: targetUserId,
    details
  })
}

export const activityModel = {
  ACTIVITY_COLLECTION_NAME,
  ACTIVITY_COLLECTION_SCHEMA,
  ACTIVITY_TYPES,
  createNew,
  findOneById,
  getAll,
  getActivitiesByUser,
  getActivitiesByResource,
  getActivitiesByType,
  getActivitiesByDateRange,
  update,
  deleteOneById,
  logBillActivity,
  logGroupActivity,
  logUserActivity
}