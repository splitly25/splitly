/* eslint-disable no-useless-catch */
import { billModel } from '~/models/billModel.js'
import { activityModel } from '~/models/activityModel.js'

/**
 * Create a new bill with splitting logic and activity logging
 * @param {Object} reqBody - Bill data from request
 * @param {Object} options - Additional options (userId for logging)
 * @returns {Promise<Object>} Created bill
 */
const createNew = async (reqBody, options = {}) => {
  try {
    let paymentStatus = []
    
    if (reqBody.splittingMethod === 'equal') {
      // Equal split: total amount / number of participants
      const amountPerPerson = reqBody.totalAmount / reqBody.participants.length
      paymentStatus = reqBody.participants.map(userId => ({
        userId: userId,
        amountOwed: amountPerPerson,
        isPaid: userId === reqBody.payerId, // Payer already paid
        paidDate: userId === reqBody.payerId ? Date.now() : null
      }))
    } else if (reqBody.splittingMethod === 'item-based') {
      // Item-based split: calculate based on items with discount/tax adjustment
      const sumOfItemAmounts = reqBody.items.reduce((sum, item) => sum + item.amount, 0)
      const adjustmentRatio = reqBody.totalAmount / sumOfItemAmounts
      
      const userAmounts = {}
      
      // Calculate total owed by each user with adjustment
      reqBody.items.forEach(item => {
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
        isPaid: userId === reqBody.payerId,
        paidDate: userId === reqBody.payerId ? Date.now() : null
      }))
    }
    
    const newBillData = {
      ...reqBody,
      paymentStatus,
      createdAt: Date.now()
    }
    
    const createdBill = await billModel.createNew(newBillData)
    const getNewBill = await billModel.findOneById(createdBill.insertedId.toString())
    
    // Log activity if creatorId is provided
    if (reqBody.creatorId) {
      try {
        await activityModel.logBillActivity(
          activityModel.ACTIVITY_TYPES.BILL_CREATED,
          reqBody.creatorId,
          createdBill.insertedId.toString(),
          {
            billName: reqBody.billName,
            amount: reqBody.totalAmount,
            description: `Created new bill: ${reqBody.billName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log bill creation activity:', activityError.message)
      }
    }
    
    return getNewBill
  } catch (error) {
    throw error
  }
}

/**
 * Get all bills
 * @returns {Promise<Array>} Array of bills
 */
const getAll = async () => {
  try {
    return await billModel.getAll()
  } catch (error) {
    throw error
  }
}

/**
 * Get all bills with pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Bills with pagination info
 */
const getAllWithPagination = async (page = 1, limit = 10) => {
  try {
    return await billModel.getAllWithPagination(page, limit)
  } catch (error) {
    throw error
  }
}

/**
 * Get bills by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of bills
 */
const getBillsByUser = async (userId) => {
  try {
    return await billModel.getBillsByUser(userId)
  } catch (error) {
    throw error
  }
}

/**
 * Get bills by user with pagination
 * @param {string} userId - User ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} Bills with pagination info
 */
const getBillsByUserWithPagination = async (userId, page = 1, limit = 10) => {
  try {
    return await billModel.getBillsByUserWithPagination(userId, page, limit)
  } catch (error) {
    throw error
  }
}

/**
 * Get bills by creator ID
 * @param {string} creatorId - Creator user ID
 * @returns {Promise<Array>} Array of bills
 */
const getBillsByCreator = async (creatorId) => {
  try {
    return await billModel.getBillsByCreator(creatorId)
  } catch (error) {
    throw error
  }
}

/**
 * Get bill by ID
 * @param {string} billId - Bill ID
 * @returns {Promise<Object>} Bill object
 */
const findOneById = async (billId) => {
  try {
    return await billModel.findOneById(billId)
  } catch (error) {
    throw error
  }
}

/**
 * Update bill with activity logging
 * @param {string} billId - Bill ID
 * @param {Object} updateData - Data to update
 * @param {string} updatedBy - User ID who updates
 * @returns {Promise<Object>} Updated bill
 */
const update = async (billId, updateData, updatedBy) => {
  try {
    // Get original bill data for activity logging
    const originalBill = await billModel.findOneById(billId)
    
    const result = await billModel.update(billId, updateData)
    
    // Log activity if updatedBy is provided
    if (updatedBy && originalBill) {
      try {
        await activityModel.logBillActivity(
          activityModel.ACTIVITY_TYPES.BILL_UPDATED,
          updatedBy,
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
    throw error
  }
}

/**
 * Mark bill as paid for a user
 * @param {string} billId - Bill ID
 * @param {string} userId - User ID who paid
 * @param {string} paidBy - User ID who marked as paid (for logging)
 * @returns {Promise<Object>} Update result
 */
const markAsPaid = async (billId, userId, paidBy) => {
  try {
    const bill = await billModel.findOneById(billId)
    
    const result = await billModel.markAsPaid(billId, userId)
    
    // Log payment activity
    if (paidBy) {
      try {
        await activityModel.logBillActivity(
          activityModel.ACTIVITY_TYPES.BILL_PAID,
          paidBy,
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
    const updatedBill = await billModel.findOneById(billId)
    const allPaid = updatedBill.paymentStatus.every(status => status.isPaid)
    
    if (allPaid) {
      await billModel.update(billId, { isSettled: true })
      
      // Log bill settlement activity
      if (paidBy) {
        try {
          await activityModel.logBillActivity(
            activityModel.ACTIVITY_TYPES.BILL_SETTLED,
            paidBy,
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
    throw error
  }
}

/**
 * User opts out from a bill
 * @param {string} billId - Bill ID
 * @param {string} userId - User ID who opts out
 * @param {string} optedOutBy - User ID for logging
 * @returns {Promise<Object>} Update result
 */
const optOutUser = async (billId, userId, optedOutBy) => {
  try {
    const bill = await billModel.findOneById(billId)
    
    const result = await billModel.optOutUser(billId, userId)
    
    // Log opt-out activity
    if (optedOutBy) {
      try {
        await activityModel.logBillActivity(
          activityModel.ACTIVITY_TYPES.BILL_USER_OPTED_OUT,
          optedOutBy,
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
    throw error
  }
}

/**
 * Delete bill by ID with activity logging
 * @param {string} billId - Bill ID
 * @param {string} deletedBy - User ID who deletes
 * @returns {Promise<Object>} Delete result
 */
const deleteOneById = async (billId, deletedBy) => {
  try {
    const bill = await billModel.findOneById(billId)
    
    const result = await billModel.deleteOneById(billId)
    
    // Log deletion activity
    if (deletedBy && bill) {
      try {
        await activityModel.logBillActivity(
          activityModel.ACTIVITY_TYPES.BILL_DELETED,
          deletedBy,
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
    throw error
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
    const bill = await billModel.findOneById(billId)
    
    // Here you would implement your actual reminder logic
    // For example: await emailService.sendReminder(...)
    
    // Log reminder activity
    if (sentByUserId) {
      try {
        await activityModel.logBillActivity(
          activityModel.ACTIVITY_TYPES.BILL_REMINDER_SENT,
          sentByUserId,
          billId,
          {
            billName: bill.billName,
            reminderType: reminderType,
            recipientId: recipientUserId,
            description: `Sent ${reminderType} reminder for bill: ${bill.billName}`
          }
        )
      } catch (activityError) {
        console.warn('Failed to log bill reminder activity:', activityError.message)
      }
    }
    
    return { success: true, message: 'Reminder sent successfully' }
  } catch (error) {
    throw error
  }
}

export const billService = {
  createNew,
  getAll,
  getAllWithPagination,
  getBillsByUser,
  getBillsByUserWithPagination,
  getBillsByCreator,
  findOneById,
  update,
  markAsPaid,
  optOutUser,
  deleteOneById,
  sendReminder
}
