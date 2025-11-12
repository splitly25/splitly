import express from 'express'
import { assistantController } from '~/controllers/assistantController.js'
import { assistantValidation } from '~/validations/assistantValidation'

const Router = express.Router()

Router.route('/').post(assistantValidation.validateAIRequest, assistantController.processAIRequest)

export const assistantRoute = Router