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

// Get payment reminder details by token (public route)
Router.get('/reminder/:token', debtController.getReminderByToken)

// Submit payment from reminder (public route)
Router.post('/reminder-payment', debtController.submitReminderPayment)

export const debtRoute = Router
