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

/**
 * Confirm payment (in-app, not via email token)
 * Body: { debtorId, amount, bills: [{ billId, amount }], note, isConfirmed }
 * Only creditor (current user) can confirm
 */
const confirmPayment = async (req, res, next) => {
  try {
    const { userId } = req.params // creditor
    const { debtorId, amount, bills, note, isConfirmed } = req.body

    // Security: Only creditor can confirm
    if (req.jwtDecoded._id !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only confirm payments to yourself')
    }
    if (!debtorId || !amount || !Array.isArray(bills) || bills.length === 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required fields')
    }

    // Get user info
    const [creditor, debtor] = await Promise.all([
      (await import('~/models/userModel.js')).userModel.findOneById(userId),
      (await import('~/models/userModel.js')).userModel.findOneById(debtorId)
    ])
    if (!creditor || !debtor) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Mark as paid for each bill (partial or full)
    let remaining = amount
    const updatedBills = []
    const { billService } = await import('~/services/billService.js')
    for (const b of bills) {
      if (remaining <= 0) break
      const payAmount = Math.min(b.amount, remaining)
      const result = await billService.markAsPaid(b.billId, debtorId, payAmount, userId)
      if (result) {
        updatedBills.push({ billId: b.billId, amountPaid: payAmount })
        remaining -= payAmount
      }
    }

    // Record payment confirmation (token: null)
    const { paymentConfirmationModel } = await import('~/models/paymentConfirmationModel.js')
    // Generate a unique token for in-app confirmation (not used for validation, just to satisfy schema)
    const token = `inapp_${Date.now()}_${Math.random().toString(36).slice(2)}`
    await paymentConfirmationModel.createNew({
      paymentId: updatedBills[0]?.billId || null,
      token,
      recipientId: userId,
      payerId: debtorId,
      amount,
      isConfirmed: !!isConfirmed
    })

    // Send email notification to payer
    const { sendPaymentResponseEmail } = await import('~/utils/emailService.js')
    await sendPaymentResponseEmail({
      payerEmail: debtor.email,
      payerName: debtor.name,
      recipientName: creditor.name,
      amount,
      isConfirmed: !!isConfirmed
    })

    res.status(StatusCodes.OK).json({
      success: true,
      updatedBills,
      message: isConfirmed ? 'Payment confirmed' : 'Payment rejected'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Send payment reminder to debtor
 * Body: { creditorId, debtorId }
 * Only creditor can send reminder
 */
const remindPayment = async (req, res, next) => {
  try {
    const { creditorId, debtorId } = req.body

    // Security: Only creditor can send reminder
    if (req.jwtDecoded._id !== creditorId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You can only send reminders for debts owed to you')
    }

    // Get debts owed to creditor
    const debts = await debtService.getDebtsOwedToMe(creditorId)

    // Find the debt for the debtor
    const debt = debts.find(d => d.userId === debtorId)
    if (!debt || debt.bills.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'No outstanding debts found for this user')
    }

    // Get user info
    const [creditor, debtor] = await Promise.all([
      (await import('~/models/userModel.js')).userModel.findOneById(creditorId),
      (await import('~/models/userModel.js')).userModel.findOneById(debtorId)
    ])
    if (!creditor || !debtor) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
    }

    // Send reminder email
    const { sendPaymentReminderEmail } = await import('~/utils/emailService.js')
    const emailSent = await sendPaymentReminderEmail({
      debtorEmail: debtor.email,
      debtorName: debtor.name,
      creditorName: creditor.name,
      bills: debt.bills.map(b => ({ billName: b.billName, amount: b.remainingAmount })),
      creditorBankName: creditor.bankName,
      creditorBankAccount: creditor.bankAccount
    })

    res.status(StatusCodes.OK).json({
      success: true,
      emailSent,
      message: 'Payment reminder sent successfully'
    })
  } catch (error) {
    next(error)
  }
}

export const debtController = {
  getDebtsOwedToMe,
  getDebtsIOwe,
  getDebtSummary,
  initiatePayment,
  confirmPayment,
  remindPayment
}
