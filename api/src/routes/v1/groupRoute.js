import express from 'express'
import { groupController } from '~/controllers/groupController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { groupValidation } from '~/validations/groupValidation'

const Router = express.Router()

Router.route('/getAllGroupAndMembers').get(authMiddleware.isAuthorized, groupController.getAllGroupAndMembers)

Router.route('/getGroupAndMembers/:groupId').get(authMiddleware.isAuthorized, groupController.getGroupAndMembers)

Router.route('/')
  .get(authMiddleware.isAuthorized, groupValidation.fetchGroups, groupController.fetchGroups)
  .post(authMiddleware.isAuthorized, groupValidation.createNew, groupController.createNew)

Router.route('/:groupId').get(authMiddleware.isAuthorized, groupController.getGroupById)

Router.route('/user/:userId').get(authMiddleware.isAuthorized, groupController.getGroupsByUserId)

Router.route('/:id')
  .put(authMiddleware.isAuthorized, groupValidation.update, groupController.update)
  .delete(authMiddleware.isAuthorized,groupController.deleteGroup)

export const groupRoute = Router
