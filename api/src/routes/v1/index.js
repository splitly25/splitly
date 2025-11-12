import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { dashboardRoute } from '~/routes/v1/dashboardRoute'
import {historyRoute} from '~/routes/v1/historyRoute'
import { billRoute } from '~/routes/v1/billRoute'
import { userRoute } from './userRoute'
import { debtRoute } from './debtRoute'
import { assistantRoute } from './assistantRoute'

const Router = express.Router()

// Check APIv1 status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'API is running' })
})

// Board API routes
Router.use('/boards', boardRoute)

// Dashboard API routes
Router.use('/dashboard', dashboardRoute)

// History API routes
Router.use('/history', historyRoute)
Router.use('/bills', billRoute)

Router.use('/users', userRoute)

// Debt API routes
Router.use('/debts', debtRoute)

// AI API routes
Router.use('/assistant', assistantRoute)

export const APIs_V1 = Router