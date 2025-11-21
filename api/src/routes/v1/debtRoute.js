import express from 'express'
import { debtValidation } from '~/validations/debtValidation.js'
import { debtController } from '~/controllers/debtController.js'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Get debts owed to the user
Router.get('/:userId/owed-to-me', authMiddleware.isAuthorized, debtValidation.getUserDebts, debtController.getDebtsOwedToMe)

// Get debts that the user owes
Router.get('/:userId/i-owe', authMiddleware.isAuthorized, debtValidation.getUserDebts, debtController.getDebtsIOwe)

// Get comprehensive debt summary
Router.get('/:userId/summary', authMiddleware.isAuthorized, debtValidation.getUserDebts, debtController.getDebtSummary)


// Initiate payment request
Router.post('/:userId/payment', authMiddleware.isAuthorized, debtValidation.getUserDebts, debtValidation.initiatePayment, debtController.initiatePayment)

// Confirm payment (in-app, not via email token)
Router.post('/:userId/confirm-payment', authMiddleware.isAuthorized, debtValidation.getUserDebts, debtValidation.confirmPayment, debtController.confirmPayment)

Router.post('/remind-payment', authMiddleware.isAuthorized, debtValidation.remindPayment, debtController.remindPayment)

// Get payment details by token (public route)
Router.get('/payment/:token', debtController.getPaymentByToken)

// Submit payment (public route)
Router.post('/payment/submit', debtController.submitPayment)

// Balance debts between two users
Router.post('/:userId/balance', authMiddleware.isAuthorized, debtValidation.getUserDebts, debtController.balanceDebts)

export const debtRoute = Router
