/**
 * Payment Confirmation API Routes
 */

import express from 'express'
import { paymentConfirmationController } from '~/controllers/paymentConfirmationController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// POST /api/v1/payment-confirmation/generate - Generate confirmation token (protected)
Router.post('/generate', authMiddleware.isAuthorized, paymentConfirmationController.generateConfirmationToken)

// GET /api/v1/payment-confirmation/verify/:token - Verify token and get payment data (public)
Router.get('/verify/:token', paymentConfirmationController.verifyConfirmationToken)

// POST /api/v1/payment-confirmation/confirm - Confirm or reject payment (public)
Router.post('/confirm', paymentConfirmationController.confirmPayment)

export const paymentConfirmationRoute = Router
