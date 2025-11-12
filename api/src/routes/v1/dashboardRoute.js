/**
 * Dashboard API Routes
 */

import express from 'express'
import { dashboardController } from '~/controllers/dashboardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// GET /api/v1/dashboard/:userId - Get dashboard data for a user
Router.get('/:userId', authMiddleware.isAuthorized, dashboardController.getDashboardData)

export const dashboardRoute = Router