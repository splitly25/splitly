/**
 * History API Routes
 */

import express from 'express'
import { historyController } from '~/controllers/historyController.js'

const Router = express.Router()

// GET /api/v1/history/bill/:billId - Get detailed information for a specific bill
// This must come before /:userId to avoid path collision
Router.get('/bill/:billId', historyController.getBillDetail)

// GET /api/v1/history/search/:userId - Search bills for a user
Router.get('/search/:userId', historyController.getBillBySearching)

// GET /api/v1/history/filter/:userId - Filter bills by date range and payer
Router.get('/filter/:userId', historyController.filterBillsByUser)

// GET /api/v1/history/:userId - Get history data for a user (with pagination and filters)
Router.get('/:userId', historyController.getHistoryData)

export const historyRoute = Router
