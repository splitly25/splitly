import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from '~/routes/v1/boardRoute'
import { dashboardRoute } from '~/routes/v1/dashboardRoute'
import { billRoute } from '~/routes/v1/billRoute'
import { userRoute } from './userRoute'

const Router = express.Router()

// Check APIv1 status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ status: 'API is running' })
})

// Board API routes
Router.use('/boards', boardRoute)

// Dashboard API routes
Router.use('/dashboard', dashboardRoute)

Router.use('/bills', billRoute)

Router.use('/users', userRoute)

export const APIs_V1 = Router