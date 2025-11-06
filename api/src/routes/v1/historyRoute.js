/**
 * History API Routes
 */

import express from 'express'
import { historyController } from '~/controllers/historyController.js'

const Router = express.Router()

// GET /api/v1/history/:userId - Get history data for a user (with pagination and filters)
Router.get('/:userId', historyController.getHistoryData)

// GET /api/v1/history/bill/:billId - Get detailed information for a specific bill
Router.get('/bill/:billId', historyController.getBillDetail)

export const historyRoute = Router