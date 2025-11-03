import Joi from 'joi'
import { GET_DB } from '~/config/mongodb.js'
import { ObjectId } from 'mongodb'

const BILL_COLLECTION_NAME = 'bills'

// Item schema for bills (for item-based splitting)
const BILL_ITEM_SCHEMA = Joi.object({
  name: Joi.string().required().trim().min(1).max(200),
  amount: Joi.number().required().min(0),
  allocatedTo: Joi.array().items(Joi.string()).min(1).required() // Changed to ObjectId string
})

// Payment status schema for each participant (in bill schema)
const PAYMENT_STATUS_SCHEMA = Joi.object({
  userId: Joi.string().required(), // Changed from userEmail to userId
  amountOwed: Joi.number().required().min(0),
  isPaid: Joi.boolean().default(false),
  paidDate: Joi.date().timestamp('javascript').default(null)
})

// Main bill schema
const BILL_COLLECTION_SCHEMA = Joi.object({
  billName: Joi.string().required().trim().min(1).max(200),
  description: Joi.string().trim().max(500).default(''),
  creatorId: Joi.string().required(), // Changed from creatorEmail to creatorId
  payerId: Joi.string().required(), // Changed from payerEmail to payerId
  totalAmount: Joi.number().required().min(0),
  paymentDate: Joi.date().timestamp('javascript').default(Date.now),
  
  splittingMethod: Joi.string().valid('equal', 'item-based').required(),
  
  // All participant user IDs
  participants: Joi.array().items(Joi.string()).min(1).required(), // Changed to ObjectId strings
  
  // Items (only for item-based splitting)
  items: Joi.array().items(BILL_ITEM_SCHEMA).default([]),
  
  paymentStatus: Joi.array().items(PAYMENT_STATUS_SCHEMA).default([]),
  
  isSettled: Joi.boolean().default(false),
  
  // User can opt out from a bill
  optedOutUsers: Joi.array().items(Joi.string()).default([]), // Changed to ObjectId strings
  
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'creatorId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await BILL_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    
    let paymentStatus = []
    
    if (validData.splittingMethod === 'equal') {
      // Equal split: total amount / number of participants
      const amountPerPerson = validData.totalAmount / validData.participants.length
      paymentStatus = validData.participants.map(userId => ({
        userId: userId,
        amountOwed: amountPerPerson,
        isPaid: userId === validData.payerId, // Payer already paid
        paidDate: userId === validData.payerId ? Date.now() : null
      }))
    } else if (validData.splittingMethod === 'item-based') {
      // Item-based split: calculate based on items with discount/tax adjustment
      
      const sumOfItemAmounts = validData.items.reduce((sum, item) => sum + item.amount, 0)
      const adjustmentRatio = validData.totalAmount / sumOfItemAmounts
      
      const userAmounts = {}
      
      // Calculate total owed by each user with adjustment
      validData.items.forEach(item => {
        const adjustedItemAmount = item.amount * adjustmentRatio
        const amountPerPerson = adjustedItemAmount / item.allocatedTo.length
        
        item.allocatedTo.forEach(userId => {
          userAmounts[userId] = (userAmounts[userId] || 0) + amountPerPerson
        })
      })
      
      // Create payment status array
      paymentStatus = Object.entries(userAmounts).map(([userId, amount]) => ({
        userId: userId,
        amountOwed: Math.round(amount),
        isPaid: userId === validData.payerId,
        paidDate: userId === validData.payerId ? Date.now() : null
      }))
    }
    
    const newBillToAdd = {
      ...validData,
      paymentStatus,
      createdAt: Date.now()
    }
    
    const createdBill = await GET_DB().collection(BILL_COLLECTION_NAME).insertOne(newBillToAdd)
    return createdBill
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (billId) => {
  try {
    const result = await GET_DB().collection(BILL_COLLECTION_NAME).findOne({
      _id: new ObjectId(billId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getAll = async () => {
  try {
    const result = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .find({ _destroy: false })
      .sort({ createdAt: -1 })
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getBillsByUser = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .find({
        participants: userId,
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getBillsByCreator = async (creatorId) => {
  try {
    const result = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .find({
        creatorId: creatorId,
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (billId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await GET_DB().collection(BILL_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(billId) },
      { $set: { ...updateData, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const markAsPaid = async (billId, userId) => {
  try {
    const result = await GET_DB().collection(BILL_COLLECTION_NAME).updateOne(
      { 
        _id: new ObjectId(billId),
        'paymentStatus.userId': userId
      },
      { 
        $set: { 
          'paymentStatus.$.isPaid': true,
          'paymentStatus.$.paidDate': Date.now(),
          updatedAt: Date.now()
        } 
      }
    )
    
    // Check if all participants have paid
    const bill = await findOneById(billId)
    const allPaid = bill.paymentStatus.every(status => status.isPaid)
    
    if (allPaid) {
      await update(billId, { isSettled: true })
    }
    
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const optOutUser = async (billId, userId) => {
  try {
    // Add user to opted out list and remove from participants
    const result = await GET_DB().collection(BILL_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(billId) },
      { 
        $addToSet: { optedOutUsers: userId },
        $pull: { 
          participants: userId,
          'paymentStatus': { userId: userId }
        },
        $set: { updatedAt: Date.now() }
      },
      { returnDocument: 'after' }
    )
    
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (billId) => {
  try {
    const result = await GET_DB().collection(BILL_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(billId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const billModel = {
  BILL_COLLECTION_NAME,
  BILL_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getAll,
  getBillsByUser,
  getBillsByCreator,
  update,
  markAsPaid,
  optOutUser,
  deleteOneById
}
