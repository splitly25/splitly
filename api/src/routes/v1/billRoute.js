import express from 'express'
import { billController } from '~/controllers/billController.js'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { billValidation } from '~/validations/billValidation.js'

const Router = express.Router()

Router.route('/').post(authMiddleware.isAuthorized, billValidation.createNew, billController.createNew)
Router.route('/user/:userId').get(authMiddleware.isAuthorized, billController.getBillsByUserId)

export const billRoute = Router
