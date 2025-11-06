/* eslint-disable no-useless-catch */
import { activityModel } from '~/models/activityModel.js'

/**
 * Get all activities with pagination
 * @param {number} limit - Number of activities to return
 * @param {number} offset - Number of activities to skip
 * @returns {Promise<Array>} Array of activities
 */
const getAll = async (limit = 100, offset = 0) => {
  try {
    return await activityModel.getAll(limit, offset)
  } catch (error) {
    throw error
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
    return await activityModel.getActivitiesByUser(userId, limit, offset)
  } catch (error) {
    throw error
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
    return await activityModel.getActivitiesByResource(resourceType, resourceId, limit)
  } catch (error) {
    throw error
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
    return await activityModel.getActivitiesByType(activityType, limit, offset)
  } catch (error) {
    throw error
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
    return await activityModel.getActivitiesByDateRange(startDate, endDate, limit)
  } catch (error) {
    throw error
  }
}

/**
 * Get activity by ID
 * @param {string} activityId - Activity ID
 * @returns {Promise<Object>} Activity object
 */
const findOneById = async (activityId) => {
  try {
    return await activityModel.findOneById(activityId)
  } catch (error) {
    throw error
  }
}

export const activityService = {
  getAll,
  getActivitiesByUser,
  getActivitiesByResource,
  getActivitiesByType,
  getActivitiesByDateRange,
  findOneById
}
