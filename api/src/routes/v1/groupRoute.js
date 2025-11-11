import express from 'express'
import { groupController } from '~/controllers/groupController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { groupValidation } from '~/validations/groupValidation'

const Router = express.Router()

Router.route('/getAllGroupAndMembers').get(authMiddleware.isAuthorized, groupController.getAllGroupAndMembers)

Router.route('/getGroupAndMembers/:groupId').get(authMiddleware.isAuthorized, groupController.getGroupAndMembers)

Router.route('/')
  .get(authMiddleware.isAuthorized, groupController.getAllGroups)
  .post(authMiddleware.isAuthorized, groupValidation.createNew, groupController.createNew)

Router.route('/:groupId').get(authMiddleware.isAuthorized, groupController.getGroupById)

export const groupRoute = Router
