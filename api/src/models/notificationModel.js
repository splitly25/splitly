import Joi from 'joi'
import { GET_DB } from '~/config/mongodb.js'
import { ObjectId } from 'mongodb'

const NOTIFICATION_COLLECTION_NAME = 'notifications'

const NOTIFICATION_TYPES = {
  // Bill notifications
  BILL_ADDED: 'bill_added',
  BILL_UPDATED: 'bill_updated',
  BILL_DELETED: 'bill_deleted',
  BILL_REMINDER: 'bill_reminder',
  BILL_SETTLED: 'bill_settled',

  // Payment notifications
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_CONFIRMED: 'payment_confirmed',
  PAYMENT_REJECTED: 'payment_rejected',
  PAYMENT_INITIATED: 'payment_initiated',

  // Group notifications
  GROUP_INVITED: 'group_invited',
  GROUP_UPDATED: 'group_updated',
  GROUP_DELETED: 'group_deleted',
  GROUP_BILL_ADDED: 'group_bill_added',
  GROUP_MEMBER_ADDED: 'group_member_added',
  GROUP_MEMBER_REMOVED: 'group_member_removed'
}

const RESOURCE_TYPES = {
  BILL: 'bill',
  PAYMENT: 'payment',
  GROUP: 'group',
  USER: 'user'
}

const NOTIFICATION_COLLECTION_SCHEMA = Joi.object({
  recipientId: Joi.object().instance(ObjectId).required(),
  actorId: Joi.object().instance(ObjectId).required(),
  type: Joi.string().valid(...Object.values(NOTIFICATION_TYPES)).required(),
  resourceType: Joi.string().valid(...Object.values(RESOURCE_TYPES)).required(),
  resourceId: Joi.object().instance(ObjectId).required(),
  title: Joi.string().max(100).required(),
  message: Joi.string().max(500).required(),
  isRead: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  readAt: Joi.date().timestamp('javascript').allow(null).default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  return await NOTIFICATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const convertedData = {
      ...data,
      recipientId: typeof data.recipientId === 'string' ? new ObjectId(data.recipientId) : data.recipientId,
      actorId: typeof data.actorId === 'string' ? new ObjectId(data.actorId) : data.actorId,
      resourceId: typeof data.resourceId === 'string' ? new ObjectId(data.resourceId) : data.resourceId
    }

    const validData = await validateBeforeCreate(convertedData)
    const notificationToAdd = {
      ...validData,
      createdAt: Date.now()
    }

    const result = await GET_DB().collection(NOTIFICATION_COLLECTION_NAME).insertOne(notificationToAdd)
    return { ...notificationToAdd, _id: result.insertedId }
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (notificationId) => {
  try {
    return await GET_DB().collection(NOTIFICATION_COLLECTION_NAME).findOne({
      _id: new ObjectId(notificationId)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const getNotificationsByUser = async (userId, filters = {}) => {
  try {
    const { limit = 20, offset = 0, unreadOnly = false } = filters

    const matchQuery = {
      recipientId: new ObjectId(userId),
      _destroy: false
    }

    if (unreadOnly) {
      matchQuery.isRead = false
    }

    const result = await GET_DB()
      .collection(NOTIFICATION_COLLECTION_NAME)
      .aggregate([
        { $match: matchQuery },
        { $sort: { createdAt: -1 } },
        { $skip: offset },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'actorId',
            foreignField: '_id',
            as: 'actorInfo'
          }
        },
        {
          $addFields: {
            actor: {
              $let: {
                vars: { actorDoc: { $arrayElemAt: ['$actorInfo', 0] } },
                in: {
                  _id: '$$actorDoc._id',
                  name: '$$actorDoc.name',
                  email: '$$actorDoc.email',
                  avatar: '$$actorDoc.avatar'
                }
              }
            }
          }
        },
        { $project: { actorInfo: 0 } }
      ])
      .toArray()

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getUnreadCount = async (userId) => {
  try {
    return await GET_DB().collection(NOTIFICATION_COLLECTION_NAME).countDocuments({
      recipientId: new ObjectId(userId),
      isRead: false,
      _destroy: false
    })
  } catch (error) {
    throw new Error(error)
  }
}

const getTotalCount = async (userId) => {
  try {
    return await GET_DB().collection(NOTIFICATION_COLLECTION_NAME).countDocuments({
      recipientId: new ObjectId(userId),
      _destroy: false
    })
  } catch (error) {
    throw new Error(error)
  }
}

const markAsRead = async (notificationId) => {
  try {
    return await GET_DB().collection(NOTIFICATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(notificationId) },
      { $set: { isRead: true, readAt: Date.now() } },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw new Error(error)
  }
}

const markAllAsRead = async (userId) => {
  try {
    return await GET_DB().collection(NOTIFICATION_COLLECTION_NAME).updateMany(
      { recipientId: new ObjectId(userId), isRead: false, _destroy: false },
      { $set: { isRead: true, readAt: Date.now() } }
    )
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (notificationId) => {
  try {
    return await GET_DB().collection(NOTIFICATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(notificationId) },
      { $set: { _destroy: true } },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw new Error(error)
  }
}

const createMany = async (notifications) => {
  try {
    if (!notifications || notifications.length === 0) return null

    const validatedNotifications = await Promise.all(
      notifications.map(async (n) => {
        const convertedData = {
          ...n,
          recipientId: typeof n.recipientId === 'string' ? new ObjectId(n.recipientId) : n.recipientId,
          actorId: typeof n.actorId === 'string' ? new ObjectId(n.actorId) : n.actorId,
          resourceId: typeof n.resourceId === 'string' ? new ObjectId(n.resourceId) : n.resourceId,
          createdAt: Date.now()
        }
        return await validateBeforeCreate(convertedData)
      })
    )

    const result = await GET_DB().collection(NOTIFICATION_COLLECTION_NAME).insertMany(validatedNotifications)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const notificationModel = {
  NOTIFICATION_COLLECTION_NAME,
  NOTIFICATION_COLLECTION_SCHEMA,
  NOTIFICATION_TYPES,
  RESOURCE_TYPES,
  createNew,
  createMany,
  findOneById,
  getNotificationsByUser,
  getUnreadCount,
  getTotalCount,
  markAsRead,
  markAllAsRead,
  deleteOneById
}
