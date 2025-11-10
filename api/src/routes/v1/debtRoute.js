import express from 'express'
import { debtValidation } from '~/validations/debtValidation.js'
import { debtController } from '~/controllers/debtController.js'

const Router = express.Router()

// Get debts owed to the user
Router.get('/:userId/owed-to-me', debtValidation.getUserDebts, debtController.getDebtsOwedToMe)

// Get debts that the user owes
Router.get('/:userId/i-owe', debtValidation.getUserDebts, debtController.getDebtsIOwe)

// Get comprehensive debt summary
Router.get('/:userId/summary', debtValidation.getUserDebts, debtController.getDebtSummary)

// Initiate payment request
Router.post('/:userId/payment', debtValidation.getUserDebts, debtValidation.initiatePayment, debtController.initiatePayment)

export const debtRoute = Router
