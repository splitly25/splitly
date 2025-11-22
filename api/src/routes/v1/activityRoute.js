import express from 'express'
import { activityController } from '~/controllers/activityController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.get('/', authMiddleware.isAuthorized, activityController.getActivities)
Router.get('/count', authMiddleware.isAuthorized, activityController.getActivityCount)

export const activityRoute = Router
