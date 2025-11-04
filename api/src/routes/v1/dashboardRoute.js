/**
 * Dashboard API Routes
 */

import express from 'express'
import { dashboardController } from '~/controllers/dashboardController'

const Router = express.Router()

// GET /api/v1/dashboard/:userId - Get dashboard data for a user
Router.get('/:userId', dashboardController.getDashboardData)

export const dashboardRoute = Router