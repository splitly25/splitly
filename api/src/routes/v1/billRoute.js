import express from 'express'
import { billController } from '~/controllers/billController.js'
import { billValidation } from '~/validations/billValidation.js'

const Router = express.Router()

Router.route('/')
  .post(billValidation.createNew, billController.createNew)


export const billRoute = Router