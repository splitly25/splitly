import { StatusCodes } from 'http-status-codes'
import { debtService } from '~/services/debtService.js'
import ApiError from '~/utils/APIError'

/**
 * Get list of people who owe money to the current user
 */
const getDebtsOwedToMe = async (req, res, next) => {
  try {
    const { userId } = req.params
    
    // Security check: Verify that the authenticated user is requesting their own data
    if (req.jwtDecoded._id !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only access your own debt data')
    }
    
    const debts = await debtService.getDebtsOwedToMe(userId)
    res.status(StatusCodes.OK).json(debts)
  } catch (error) {
    next(error)
  }
}

/**
 * Get list of people that the current user owes money to
 */
const getDebtsIOwe = async (req, res, next) => {
  try {
    const { userId } = req.params
    
    // Security check: Verify that the authenticated user is requesting their own data
    if (req.jwtDecoded._id !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only access your own debt data')
    }
    
    const debts = await debtService.getDebtsIOwe(userId)
    res.status(StatusCodes.OK).json(debts)
  } catch (error) {
    next(error)
  }
}

/**
 * Get comprehensive debt summary for the user
 */
const getDebtSummary = async (req, res, next) => {
  try {
    const { userId } = req.params
    
    // Security check: Verify that the authenticated user is requesting their own data
    if (req.jwtDecoded._id !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only access your own debt data')
    }
    
    const summary = await debtService.getDebtSummary(userId)
    res.status(StatusCodes.OK).json(summary)
  } catch (error) {
    next(error)
  }
}

/**
 * Initiate payment request
 */
const initiatePayment = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { creditorId, amount, note } = req.body
    
    // Security check: Verify that the authenticated user is initiating payment for themselves
    if (req.jwtDecoded._id !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only initiate payment for yourself')
    }
    
    const result = await debtService.initiatePayment(userId, creditorId, amount, note)
    
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const debtController = {
  getDebtsOwedToMe,
  getDebtsIOwe,
  getDebtSummary,
  initiatePayment
}
