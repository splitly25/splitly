import Joi from 'joi'
import { GET_DB } from '~/config/mongodb.js'
import { ObjectId } from 'mongodb'

const GROUP_COLLECTION_NAME = 'groups'

// Import activity model for logging (avoid circular dependency by lazy loading)
let activityModel = null
const getActivityModel = async () => {
  if (!activityModel) {
    const { activityModel: am } = await import('./activityModel.js')
    activityModel = am
  }
  return activityModel
}

const GROUP_COLLECTION_SCHEMA = Joi.object({
  groupName: Joi.string().required().trim().min(1).max(100),
  description: Joi.string().trim().max(500).default(''),
  creatorId: Joi.string().required(), // Changed from creatorEmail to creatorId
  
  // All member user IDs
  members: Joi.array().items(Joi.string()).min(1).required(), // Changed to ObjectId strings

  // All bill IDs associated with this group
  bills: Joi.array().items(Joi.string()).default([]),
  
  avatar: Joi.string().uri().default(null),
  
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'creatorId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await GROUP_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data, options = {}) => {
  try {
    const validData = await validateBeforeCreate(data)
    
    // Ensure creator is in members list
    if (!validData.members.includes(validData.creatorId)) {
      validData.members.push(validData.creatorId)
    }
    
    const newGroupToAdd = {
      ...validData,
      createdAt: Date.now()
    }
    
    const createdGroup = await GET_DB().collection(GROUP_COLLECTION_NAME).insertOne(newGroupToAdd)
    
    // Log activity if enabled
    if (options.logActivity !== false && validData.creatorId) {
      try {
        const am = await getActivityModel()
        await am.logGroupActivity(
          am.ACTIVITY_TYPES.GROUP_CREATED,
          validData.creatorId,
          createdGroup.insertedId.toString(),
          {
            groupName: validData.groupName,
            description: `Created new group: ${validData.groupName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log group creation activity:', activityError.message)
      }
    }
    
    return createdGroup
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (groupId) => {
  try {
    const result = await GET_DB().collection(GROUP_COLLECTION_NAME).findOne({
      _id: new ObjectId(groupId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async () => {
  try {
    const result = await GET_DB()
      .collection(GROUP_COLLECTION_NAME)
      .find({ _destroy: false })
      .sort({ createdAt: -1 })
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getGroupsByUser = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(GROUP_COLLECTION_NAME)
      .find({
        members: userId,
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (groupId, updateData, options = {}) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    // Get original group data for activity logging
    let originalGroup = null
    if (options.logActivity !== false && options.updatedBy) {
      originalGroup = await findOneById(groupId)
    }

    const result = await GET_DB().collection(GROUP_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(groupId) },
      { $set: { ...updateData, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )

    // Log activity if enabled
    if (options.logActivity !== false && options.updatedBy && originalGroup) {
      try {
        const am = await getActivityModel()
        await am.logGroupActivity(
          am.ACTIVITY_TYPES.GROUP_UPDATED,
          options.updatedBy,
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
    throw new Error(error)
  }
}

const addMember = async (groupId, memberId, options = {}) => {
  try {
    const group = await findOneById(groupId)
    
    const result = await GET_DB().collection(GROUP_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(groupId) },
      { 
        $addToSet: { members: memberId },
        $set: { updatedAt: Date.now() }
      },
      { returnDocument: 'after' }
    )

    // Log activity if enabled
    if (options.logActivity !== false && options.addedBy) {
      try {
        const am = await getActivityModel()
        await am.logGroupActivity(
          am.ACTIVITY_TYPES.GROUP_MEMBER_ADDED,
          options.addedBy,
          groupId,
          {
            groupName: group.groupName,
            memberId: memberId,
            memberEmail: options.memberEmail,
            description: `Added member to group: ${group.groupName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log group member addition activity:', activityError.message)
      }
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const removeMember = async (groupId, memberId, options = {}) => {
  try {
    const group = await findOneById(groupId)
    
    const result = await GET_DB().collection(GROUP_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(groupId) },
      { 
        $pull: { members: memberId },
        $set: { updatedAt: Date.now() }
      },
      { returnDocument: 'after' }
    )

    // Log activity if enabled
    if (options.logActivity !== false && options.removedBy) {
      try {
        const am = await getActivityModel()
        await am.logGroupActivity(
          am.ACTIVITY_TYPES.GROUP_MEMBER_REMOVED,
          options.removedBy,
          groupId,
          {
            groupName: group.groupName,
            memberId: memberId,
            memberEmail: options.memberEmail,
            description: `Removed member from group: ${group.groupName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log group member removal activity:', activityError.message)
      }
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addBill = async (groupId, billId, options = {}) => {
  try {
    const group = await findOneById(groupId)
    
    const result = await GET_DB().collection(GROUP_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(groupId) },
      { 
        $addToSet: { bills: billId },
        $set: { updatedAt: Date.now() }
      },
      { returnDocument: 'after' }
    )

    // Log activity if enabled
    if (options.logActivity !== false && options.addedBy) {
      try {
        const am = await getActivityModel()
        await am.logGroupActivity(
          am.ACTIVITY_TYPES.GROUP_BILL_ADDED,
          options.addedBy,
          groupId,
          {
            groupName: group.groupName,
            billName: options.billName,
            description: `Added bill "${options.billName || 'Unknown'}" to group: ${group.groupName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log group bill addition activity:', activityError.message)
      }
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (groupId, options = {}) => {
  try {
    let group = null
    if (options.logActivity !== false && options.deletedBy) {
      group = await findOneById(groupId)
    }
    
    const result = await GET_DB().collection(GROUP_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(groupId)
    })

    // Log deletion activity
    if (options.logActivity !== false && options.deletedBy && group) {
      try {
        const am = await getActivityModel()
        await am.logGroupActivity(
          am.ACTIVITY_TYPES.GROUP_DELETED,
          options.deletedBy,
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
    throw new Error(error)
  }
}

export const groupModel = {
  GROUP_COLLECTION_NAME,
  GROUP_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getAll,
  getGroupsByUser,
  update,
  addMember,
  removeMember,
  addBill,
  deleteOneById
}
