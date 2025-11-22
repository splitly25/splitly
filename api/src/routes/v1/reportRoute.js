/**
 * Report API Routes
 * Handles report and analytics endpoints
 */

import express from 'express'
import { reportController } from '~/controllers/reportController.js'
import { authMiddleware } from '~/middlewares/authMiddleware.js'

const Router = express.Router()

/**
 * GET /api/v1/reports/:userId - Get monthly report data for a user
 * Query params: year (YYYY), month (1-12)
 */
Router.get('/:userId', authMiddleware.isAuthorized, reportController.getMonthlyReport)

export const reportRoute = Router
