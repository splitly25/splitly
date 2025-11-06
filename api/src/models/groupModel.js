import Joi from 'joi'
import { GET_DB } from '~/config/mongodb.js'
import { ObjectId } from 'mongodb'

const GROUP_COLLECTION_NAME = 'groups'

const GROUP_COLLECTION_SCHEMA = Joi.object({
  groupName: Joi.string().required().trim().min(1).max(100),
  description: Joi.string().trim().max(500).default(''),
  creatorId: Joi.string().required(),
  members: Joi.array().items(Joi.string()).min(1).required(),
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

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newGroupToAdd = {
      ...validData,
      createdAt: Date.now()
    }
    const createdGroup = await GET_DB().collection(GROUP_COLLECTION_NAME).insertOne(newGroupToAdd)
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

const update = async (groupId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await GET_DB().collection(GROUP_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(groupId) },
      { $set: { ...updateData, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addMember = async (groupId, memberId) => {
  try {
    const result = await GET_DB().collection(GROUP_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(groupId) },
      { 
        $addToSet: { members: memberId },
        $set: { updatedAt: Date.now() }
      },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const removeMember = async (groupId, memberId) => {
  try {
    const result = await GET_DB().collection(GROUP_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(groupId) },
      { 
        $pull: { members: memberId },
        $set: { updatedAt: Date.now() }
      },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const addBill = async (groupId, billId) => {
  try {
    const result = await GET_DB().collection(GROUP_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(groupId) },
      { 
        $addToSet: { bills: billId },
        $set: { updatedAt: Date.now() }
      },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (groupId) => {
  try {
    const result = await GET_DB().collection(GROUP_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(groupId)
    })
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
