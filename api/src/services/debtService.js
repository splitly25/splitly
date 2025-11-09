/* eslint-disable no-useless-catch */
import { billModel } from '~/models/billModel.js'
import { userModel } from '~/models/userModel.js'

/**
 * Calculate debts for people who owe money to the current user
 * @param {string} userId - Current user ID
 * @returns {Promise<Array>} Array of debt objects with user info and total amount
 */
const getDebtsOwedToMe = async (userId) => {
  try {
    // Get all bills where the current user is the payer
    const bills = await billModel.getBillsByUser(userId)
    
    // Filter bills where current user is the payer
    const billsAsPayer = bills.filter(bill => bill.payerId === userId)
    
    // Calculate debts grouped by debtor
    const debtsByUser = {}
    
    billsAsPayer.forEach(bill => {
      bill.paymentStatus?.forEach(payment => {
        // Skip if it's the current user or if already paid
        if (payment.userId === userId || payment.isPaid) return
        
        // Add to debt total for this user
        if (!debtsByUser[payment.userId]) {
          debtsByUser[payment.userId] = {
            userId: payment.userId,
            totalAmount: 0,
            bills: []
          }
        }
        
        debtsByUser[payment.userId].totalAmount += payment.amountOwed
        debtsByUser[payment.userId].bills.push({
          billId: bill._id.toString(),
          billName: bill.billName,
          amountOwed: payment.amountOwed,
          isPaid: payment.isPaid
        })
      })
    })
    
    // Get user details for all debtors
    const debtorIds = Object.keys(debtsByUser)
    if (debtorIds.length === 0) {
      return []
    }
    
    const debtorUsers = await userModel.findManyByIds(debtorIds)
    
    // Combine debt info with user info
    const debtsWithUserInfo = debtorIds.map(debtorId => {
      const user = debtorUsers.find(u => u._id.toString() === debtorId)
      return {
        userId: debtorId,
        userName: user?.name || 'Unknown User',
        userAvatar: user?.avatar || null,
        userEmail: user?.email || null,
        totalAmount: Math.round(debtsByUser[debtorId].totalAmount),
        bills: debtsByUser[debtorId].bills
      }
    })
    
    // Sort by total amount descending
    return debtsWithUserInfo.sort((a, b) => b.totalAmount - a.totalAmount)
  } catch (error) {
    throw error
  }
}

/**
 * Calculate debts that the current user owes to others
 * @param {string} userId - Current user ID
 * @returns {Promise<Array>} Array of debt objects with user info and total amount
 */
const getDebtsIOwe = async (userId) => {
  try {
    // Get all bills where the current user is a participant
    const bills = await billModel.getBillsByUser(userId)
    
    // Calculate debts grouped by creditor (payer)
    const debtsByPayer = {}
    
    bills.forEach(bill => {
      // Find current user's payment status
      const myPayment = bill.paymentStatus?.find(payment => payment.userId === userId)
      
      // Skip if not found, already paid, or user is the payer
      if (!myPayment || myPayment.isPaid || bill.payerId === userId) return
      
      // Add to debt total for this payer
      if (!debtsByPayer[bill.payerId]) {
        debtsByPayer[bill.payerId] = {
          userId: bill.payerId,
          totalAmount: 0,
          bills: []
        }
      }
      
      debtsByPayer[bill.payerId].totalAmount += myPayment.amountOwed
      debtsByPayer[bill.payerId].bills.push({
        billId: bill._id.toString(),
        billName: bill.billName,
        amountOwed: myPayment.amountOwed,
        isPaid: myPayment.isPaid
      })
    })
    
    // Get user details for all payers
    const payerIds = Object.keys(debtsByPayer)
    if (payerIds.length === 0) {
      return []
    }
    
    const payerUsers = await userModel.findManyByIds(payerIds)
    
    // Combine debt info with user info
    const debtsWithUserInfo = payerIds.map(payerId => {
      const user = payerUsers.find(u => u._id.toString() === payerId)
      return {
        userId: payerId,
        userName: user?.name || 'Unknown User',
        userAvatar: user?.avatar || null,
        userEmail: user?.email || null,
        totalAmount: Math.round(debtsByPayer[payerId].totalAmount),
        bills: debtsByPayer[payerId].bills
      }
    })
    
    // Sort by total amount descending
    return debtsWithUserInfo.sort((a, b) => b.totalAmount - a.totalAmount)
  } catch (error) {
    throw error
  }
}

/**
 * Get summary of debts (both owed to me and I owe)
 * @param {string} userId - Current user ID
 * @returns {Promise<Object>} Summary object with both debt types and totals
 */
const getDebtSummary = async (userId) => {
  try {
    const [owedToMe, iOwe] = await Promise.all([
      getDebtsOwedToMe(userId),
      getDebtsIOwe(userId)
    ])
    
    const totalOwedToMe = owedToMe.reduce((sum, debt) => sum + debt.totalAmount, 0)
    const totalIOwe = iOwe.reduce((sum, debt) => sum + debt.totalAmount, 0)
    
    return {
      owedToMe: {
        debts: owedToMe,
        total: totalOwedToMe,
        count: owedToMe.length
      },
      iOwe: {
        debts: iOwe,
        total: totalIOwe,
        count: iOwe.length
      },
      netBalance: totalOwedToMe - totalIOwe
    }
  } catch (error) {
    throw error
  }
}

export const debtService = {
  getDebtsOwedToMe,
  getDebtsIOwe,
  getDebtSummary
}
