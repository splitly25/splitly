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

// /**
//  * Full text search bills by user with pagination
//  * Searches across multiple fields: billName, description, paymentDate
//  * Also supports partial date matching (day, month, year)
//  * @param {string} userId - User ID to search bills for
//  * @param {string} searchTerm - Search term for full text search
//  * @param {number} page - Page number
//  * @param {number} limit - Items per page
//  * @returns {Promise<Object>} Bills with pagination info
//  */
// const searchBillsByUserWithPagination = async (userId, searchTerm, page = 1, limit = 10) => {
//   try {
//     if (!searchTerm || searchTerm.trim() === '') {
//       // If no search term, return all bills
//       return await billModel.getBillsByUserWithPagination(userId, page, limit)
//     }

//     const trimmedSearch = searchTerm.trim();
    
//     // Build full text search query
//     const searchQuery = {
//       $or: [
//         // Search in bill name (case-insensitive)
//         { billName: { $regex: trimmedSearch, $options: 'i' } },
//         // Search in description (case-insensitive)
//         { description: { $regex: trimmedSearch, $options: 'i' } }
//       ]
//     };
    
//     // Try to parse search term as a full date and add exact date match
//     const datePatterns = [
//       { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, format: 'DD/MM/YYYY' }, // DD/MM/YYYY
//       { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/, format: 'DD-MM-YYYY' },   // DD-MM-YYYY
//       { regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, format: 'YYYY-MM-DD' }    // YYYY-MM-DD
//     ];
    
//     let dateMatched = false;
//     for (const { regex, format } of datePatterns) {
//       const match = trimmedSearch.match(regex);
//       if (match) {
//         let year, month, day;
//         if (format === 'YYYY-MM-DD') {
//           [, year, month, day] = match;
//         } else {
//           [, day, month, year] = match;
//         }
        
//         // Create start and end of day timestamps
//         const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
//         const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
        
//         if (!isNaN(startDate.getTime())) {
//           searchQuery.$or.push({
//             paymentDate: {
//               $gte: startDate.getTime(),
//               $lte: endDate.getTime()
//             }
//           });
//           dateMatched = true;
//         }
//         break;
//       }
//     }
    
//     // If not a full date, try partial date matching
//     if (!dateMatched) {
//       // Check if it's a number that could be a day, month, or year
//       const numericSearch = parseInt(trimmedSearch);
//       if (!isNaN(numericSearch)) {
//         // Could be searching for day (1-31), month (1-12), or year (2000+)
//         if (numericSearch >= 1 && numericSearch <= 31) {
//           // Might be searching for a specific day of month
//           // We'll search for any date where the day matches
//           const dayRegex = new RegExp(`\\b${numericSearch}\\b`);
          
//           // Get all bills first and filter by day (less efficient but flexible)
//           // Alternative: Add more specific date range queries if needed
//         }
        
//         if (numericSearch >= 1 && numericSearch <= 12) {
//           // Might be searching for a specific month
//           // Can add month-specific search here if needed
//         }
        
//         if (numericSearch >= 2000 && numericSearch <= 2100) {
//           // Searching for a year
//           const yearStart = new Date(numericSearch, 0, 1, 0, 0, 0, 0);
//           const yearEnd = new Date(numericSearch, 11, 31, 23, 59, 59, 999);
          
//           searchQuery.$or.push({
//             paymentDate: {
//               $gte: yearStart.getTime(),
//               $lte: yearEnd.getTime()
//             }
//           });
//         }
//       }
      
//       // Also support searching for month names (Vietnamese)
//       const monthNames = {
//         'tháng 1': 0, 'thang 1': 0, 'january': 0, 'jan': 0, '01': 0,
//         'tháng 2': 1, 'thang 2': 1, 'february': 1, 'feb': 1, '02': 1,
//         'tháng 3': 2, 'thang 3': 2, 'march': 2, 'mar': 2, '03': 2,
//         'tháng 4': 3, 'thang 4': 3, 'april': 3, 'apr': 3, '04': 3,
//         'tháng 5': 4, 'thang 5': 4, 'may': 4, '05': 4,
//         'tháng 6': 5, 'thang 6': 5, 'june': 5, 'jun': 5, '06': 5,
//         'tháng 7': 6, 'thang 7': 6, 'july': 6, 'jul': 6, '07': 6,
//         'tháng 8': 7, 'thang 8': 7, 'august': 7, 'aug': 7, '08': 7,
//         'tháng 9': 8, 'thang 9': 8, 'september': 8, 'sep': 8, '09': 8,
//         'tháng 10': 9, 'thang 10': 9, 'october': 9, 'oct': 9, '10': 9,
//         'tháng 11': 10, 'thang 11': 10, 'november': 10, 'nov': 10, '11': 10,
//         'tháng 12': 11, 'thang 12': 11, 'december': 11, 'dec': 11, '12': 11
//       };
      
//       const searchLower = trimmedSearch.toLowerCase();
//       const monthNumber = monthNames[searchLower];
      
//       if (monthNumber !== undefined) {
//         // Search for any date in this month (current year or all years)
//         const currentYear = new Date().getFullYear();
//         const monthStart = new Date(currentYear, monthNumber, 1, 0, 0, 0, 0);
//         const monthEnd = new Date(currentYear, monthNumber + 1, 0, 23, 59, 59, 999);
        
//         searchQuery.$or.push({
//           paymentDate: {
//             $gte: monthStart.getTime(),
//             $lte: monthEnd.getTime()
//           }
//         });
//       }
//     }
    
//     // Call model with custom query
//     return await billModel.searchBillsByUserWithPagination(userId, searchQuery, page, limit)
//   } catch (error) {
//     throw error
//   }
// }

export const billService = {
  createNew,
  getAll,
  getAllWithPagination,
  getBillsByUser,
  getBillsByUserWithPagination,
  // searchBillsByUserWithPagination,
  getBillsByCreator,
  findOneById,
  update,
  markAsPaid,
  optOutUser,
  deleteOneById,
  sendReminder
}
