/* eslint-disable no-useless-catch */
import { groupModel } from '~/models/groupModel.js'
import { activityModel } from '~/models/activityModel.js'

/**
 * Create a new group with activity logging
 * @param {Object} reqBody - Group data
 * @param {string} creatorId - Creator user ID
 * @returns {Promise<Object>} Created group
 */
const createNew = async (reqBody, creatorId) => {
  try {
    // Ensure creator is in members list
    const members = reqBody.members || []
    if (!members.includes(creatorId)) {
      members.push(creatorId)
    }
    
    const groupData = {
      ...reqBody,
      creatorId,
      members,
      createdAt: Date.now()
    }
    
    const createdGroup = await groupModel.createNew(groupData)
    const newGroup = await groupModel.findOneById(createdGroup.insertedId.toString())
    
    // Log group creation activity
    try {
      await activityModel.logGroupActivity(
        activityModel.ACTIVITY_TYPES.GROUP_CREATED,
        creatorId,
        createdGroup.insertedId.toString(),
        {
          groupName: reqBody.groupName,
          description: `Created new group: ${reqBody.groupName}`
        }
      )
    } catch (activityError) {
      console.warn('Failed to log group creation activity:', activityError.message)
    }
    
    return newGroup
  } catch (error) {
    throw error
  }
}

/**
 * Get all groups
 * @returns {Promise<Array>} Array of groups
 */
const getAll = async () => {
  try {
    return await groupModel.getAll()
  } catch (error) {
    throw error
  }
}

/**
 * Get groups by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of groups
 */
const getGroupsByUser = async (userId) => {
  try {
    return await groupModel.getGroupsByUser(userId)
  } catch (error) {
    throw error
  }
}

/**
 * Get group by ID
 * @param {string} groupId - Group ID
 * @returns {Promise<Object>} Group object
 */
const findOneById = async (groupId) => {
  try {
    return await groupModel.findOneById(groupId)
  } catch (error) {
    throw error
  }
}

/**
 * Update group with activity logging
 * @param {string} groupId - Group ID
 * @param {Object} updateData - Data to update
 * @param {string} updatedBy - User ID who updates
 * @returns {Promise<Object>} Updated group
 */
const update = async (groupId, updateData, updatedBy) => {
  try {
    // Get original group data for activity logging
    const originalGroup = await groupModel.findOneById(groupId)
    
    const result = await groupModel.update(groupId, updateData)
    
    // Log activity if updatedBy is provided
    if (updatedBy && originalGroup) {
      try {
        await activityModel.logGroupActivity(
          activityModel.ACTIVITY_TYPES.GROUP_UPDATED,
          updatedBy,
          groupId,
          {
            groupName: originalGroup.groupName,
            previousValue: {
              groupName: originalGroup.groupName,
              description: originalGroup.description
            },
            newValue: updateData,
            description: `Updated group: ${originalGroup.groupName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log group update activity:', activityError.message)
      }
    }
    
    return result
  } catch (error) {
    throw error
  }
}

/**
 * Add member to group with activity logging
 * @param {string} groupId - Group ID
 * @param {string} memberId - Member user ID to add
 * @param {string} addedBy - User ID who adds the member
 * @param {string} memberEmail - Member email (optional, for logging)
 * @returns {Promise<Object>} Updated group
 */
const addMember = async (groupId, memberId, addedBy, memberEmail) => {
  try {
    const group = await groupModel.findOneById(groupId)
    
    const result = await groupModel.addMember(groupId, memberId)
    
    // Log activity if addedBy is provided
    if (addedBy) {
      try {
        await activityModel.logGroupActivity(
          activityModel.ACTIVITY_TYPES.GROUP_MEMBER_ADDED,
          addedBy,
          groupId,
          {
            groupName: group.groupName,
            memberId: memberId,
            memberEmail: memberEmail,
            description: `Added member to group: ${group.groupName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log group member addition activity:', activityError.message)
      }
    }
    
    return result
  } catch (error) {
    throw error
  }
}

/**
 * Remove member from group with activity logging
 * @param {string} groupId - Group ID
 * @param {string} memberId - Member user ID to remove
 * @param {string} removedBy - User ID who removes the member
 * @param {string} memberEmail - Member email (optional, for logging)
 * @returns {Promise<Object>} Updated group
 */
const removeMember = async (groupId, memberId, removedBy, memberEmail) => {
  try {
    const group = await groupModel.findOneById(groupId)
    
    const result = await groupModel.removeMember(groupId, memberId)
    
    // Log activity if removedBy is provided
    if (removedBy) {
      try {
        await activityModel.logGroupActivity(
          activityModel.ACTIVITY_TYPES.GROUP_MEMBER_REMOVED,
          removedBy,
          groupId,
          {
            groupName: group.groupName,
            memberId: memberId,
            memberEmail: memberEmail,
            description: `Removed member from group: ${group.groupName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log group member removal activity:', activityError.message)
      }
    }
    
    return result
  } catch (error) {
    throw error
  }
}

/**
 * Add bill to group with activity logging
 * @param {string} groupId - Group ID
 * @param {string} billId - Bill ID to add
 * @param {string} addedBy - User ID who adds the bill
 * @param {string} billName - Bill name (optional, for logging)
 * @returns {Promise<Object>} Updated group
 */
const addBill = async (groupId, billId, addedBy, billName) => {
  try {
    const group = await groupModel.findOneById(groupId)
    
    const result = await groupModel.addBill(groupId, billId)
    
    // Log activity if addedBy is provided
    if (addedBy) {
      try {
        await activityModel.logGroupActivity(
          activityModel.ACTIVITY_TYPES.GROUP_BILL_ADDED,
          addedBy,
          groupId,
          {
            groupName: group.groupName,
            billName: billName,
            description: `Added bill "${billName || 'Unknown'}" to group: ${group.groupName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log group bill addition activity:', activityError.message)
      }
    }
    
    return result
  } catch (error) {
    throw error
  }
}

/**
 * Delete group by ID with activity logging
 * @param {string} groupId - Group ID
 * @param {string} deletedBy - User ID who deletes
 * @returns {Promise<Object>} Delete result
 */
const deleteOneById = async (groupId, deletedBy) => {
  try {
    const group = await groupModel.findOneById(groupId)
    
    const result = await groupModel.deleteOneById(groupId)
    
    // Log deletion activity
    if (deletedBy && group) {
      try {
        await activityModel.logGroupActivity(
          activityModel.ACTIVITY_TYPES.GROUP_DELETED,
          deletedBy,
          groupId,
          {
            groupName: group.groupName,
            description: `Deleted group: ${group.groupName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log group deletion activity:', activityError.message)
      }
    }
    
    return result
  } catch (error) {
    throw error
  }
}

export const groupService = {
  createNew,
  getAll,
  getGroupsByUser,
  findOneById,
  update,
  addMember,
  removeMember,
  addBill,
  deleteOneById
}
