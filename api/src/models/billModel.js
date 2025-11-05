import Joi from 'joi'
import { GET_DB } from '~/config/mongodb.js'
import { ObjectId } from 'mongodb'

const BILL_COLLECTION_NAME = 'bills'

// Import activity model for logging (avoid circular dependency by lazy loading)
let activityModel = null
const getActivityModel = async () => {
  if (!activityModel) {
    const { activityModel: am } = await import('./activityModel.js')
    activityModel = am
  }
  return activityModel
}

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

const createNew = async (data, options = {}) => {
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
    
    // Log activity if enabled and creatorId is provided
    if (options.logActivity !== false && validData.creatorId) {
      try {
        const am = await getActivityModel()
        await am.logBillActivity(
          am.ACTIVITY_TYPES.BILL_CREATED,
          validData.creatorId,
          createdBill.insertedId.toString(),
          {
            billName: validData.billName,
            amount: validData.totalAmount,
            description: `Created new bill: ${validData.billName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log bill creation activity:', activityError.message)
      }
    }
    
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

const update = async (billId, updateData, options = {}) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    // Get original bill data for activity logging
    let originalBill = null
    if (options.logActivity !== false && options.updatedBy) {
      originalBill = await findOneById(billId)
    }

    const result = await GET_DB().collection(BILL_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(billId) },
      { $set: { ...updateData, updatedAt: Date.now() } },
      { returnDocument: 'after' }
    )

    // Log activity if enabled
    if (options.logActivity !== false && options.updatedBy && originalBill) {
      try {
        const am = await getActivityModel()
        await am.logBillActivity(
          am.ACTIVITY_TYPES.BILL_UPDATED,
          options.updatedBy,
          billId,
          {
            billName: originalBill.billName,
            previousValue: {
              billName: originalBill.billName,
              totalAmount: originalBill.totalAmount,
              description: originalBill.description
            },
            newValue: updateData,
            description: `Updated bill: ${originalBill.billName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log bill update activity:', activityError.message)
      }
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const markAsPaid = async (billId, userId, options = {}) => {
  try {
    const bill = await findOneById(billId)
    
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
    
    // Log payment activity
    if (options.logActivity !== false && options.paidBy) {
      try {
        const am = await getActivityModel()
        await am.logBillActivity(
          am.ACTIVITY_TYPES.BILL_PAID,
          options.paidBy,
          billId,
          {
            billName: bill.billName,
            paymentStatus: 'paid',
            description: `Marked payment as completed for bill: ${bill.billName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log bill payment activity:', activityError.message)
      }
    }
    
    // Check if all participants have paid
    const updatedBill = await findOneById(billId)
    const allPaid = updatedBill.paymentStatus.every(status => status.isPaid)
    
    if (allPaid) {
      await update(billId, { isSettled: true }, { logActivity: false })
      
      // Log bill settlement activity
      if (options.logActivity !== false && options.paidBy) {
        try {
          const am = await getActivityModel()
          await am.logBillActivity(
            am.ACTIVITY_TYPES.BILL_SETTLED,
            options.paidBy,
            billId,
            {
              billName: bill.billName,
              description: `Bill fully settled: ${bill.billName}`
            }
          )
        } catch (activityError) {
          console.warn('Failed to log bill settlement activity:', activityError.message)
        }
      }
    }
    
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const optOutUser = async (billId, userId, options = {}) => {
  try {
    const bill = await findOneById(billId)
    
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
    
    // Log opt-out activity
    if (options.logActivity !== false && options.optedOutBy) {
      try {
        const am = await getActivityModel()
        await am.logBillActivity(
          am.ACTIVITY_TYPES.BILL_USER_OPTED_OUT,
          options.optedOutBy,
          billId,
          {
            billName: bill.billName,
            description: `User opted out from bill: ${bill.billName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log bill opt-out activity:', activityError.message)
      }
    }
    
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteOneById = async (billId, options = {}) => {
  try {
    let bill = null
    if (options.logActivity !== false && options.deletedBy) {
      bill = await findOneById(billId)
    }
    
    const result = await GET_DB().collection(BILL_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(billId)
    })
    
    // Log deletion activity
    if (options.logActivity !== false && options.deletedBy && bill) {
      try {
        const am = await getActivityModel()
        await am.logBillActivity(
          am.ACTIVITY_TYPES.BILL_DELETED,
          options.deletedBy,
          billId,
          {
            billName: bill.billName,
            amount: bill.totalAmount,
            description: `Deleted bill: ${bill.billName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log bill deletion activity:', activityError.message)
      }
    }
    
    return result
  } catch (error) {
    throw new Error(error)
  }
}



/**
 * Send bill reminder with activity logging
 * @param {string} billId - Bill ID
 * @param {string} reminderType - Type of reminder ('email', 'sms', 'notification')
 * @param {string} recipientUserId - User ID who receives the reminder
 * @param {string} sentByUserId - User ID who sends the reminder
 * @returns {Promise<Object>} Reminder result
 */
const sendReminder = async (billId, reminderType, recipientUserId, sentByUserId) => {
  try {
    const bill = await findOneById(billId)
    
    // Here you would implement your actual reminder logic
    // For example: await emailService.sendReminder(...)
    
    // Log reminder activity
    const am = await getActivityModel()
    await am.logBillActivity(
      am.ACTIVITY_TYPES.BILL_REMINDER_SENT,
      sentByUserId,
      billId,
      {
        billName: bill.billName,
        reminderType: reminderType,
        recipientId: recipientUserId,
        description: `Sent ${reminderType} reminder for bill: ${bill.billName}`
      }
    )
    
    return { success: true, message: 'Reminder sent successfully' }
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Get bills by user with pagination
 * @param {string} userId - User ID to get bills for
 * @param {number} page - Page number (starts from 1)
 * @param {number} limit - Number of bills per page
 * @returns {Promise<{bills: Array, pagination: Object}>} - Bills and pagination info
 */
const getBillsByUserWithPagination = async (userId, page = 1, limit = 10) => {
  try {
    // Calculate skip value (0-indexed)
    const skip = (page - 1) * limit
    
    // Get total count for pagination metadata
    const totalCount = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .countDocuments({
        participants: userId,
        _destroy: false
      })
    
    // Get bills with pagination
    const bills = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .find({
        participants: userId,
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return {
      bills,
      pagination: {
        currentPage: page,
        totalPages,
        totalBills: totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Get all bills with pagination
 * @param {number} page - Page number (starts from 1)
 * @param {number} limit - Number of bills per page
 * @returns {Promise<{bills: Array, pagination: Object}>} - Bills and pagination info
 */
const getAllWithPagination = async (page = 1, limit = 10) => {
  try {
    // Calculate skip value (0-indexed)
    const skip = (page - 1) * limit
    
    // Get total count for pagination metadata
    const totalCount = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .countDocuments({ _destroy: false })
    
    // Get bills with pagination
    const bills = await GET_DB()
      .collection(BILL_COLLECTION_NAME)
      .find({ _destroy: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return {
      bills,
      pagination: {
        currentPage: page,
        totalPages,
        totalBills: totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      }
    }
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
  deleteOneById,
  sendReminder,
  getBillsByUserWithPagination,
  getAllWithPagination
}
