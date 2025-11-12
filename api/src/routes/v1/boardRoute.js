import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized,(req, res) => {
    res.status(StatusCodes.OK).json({ status: 'API is running' })
  })
  .post(authMiddleware.isAuthorized,boardValidation.createNew, boardController.createNew)


export const boardRoute = Router