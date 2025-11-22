import express from 'express'
import { assistantController } from '~/controllers/assistantController.js'
import { assistantValidation } from '~/validations/assistantValidation'
import { authMiddleware } from '~/middlewares/authMiddleware.js'

const Router = express.Router()

Router.route('/').post(assistantValidation.validateAIRequest, assistantController.processAIRequest)

// AI Analysis endpoint for reports
Router.route('/analysis/:userId').get(authMiddleware.isAuthorized, assistantController.analysisByAssistant)

export const assistantRoute = Router