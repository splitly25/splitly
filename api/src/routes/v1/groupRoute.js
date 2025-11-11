import express from 'express'
import { groupController } from '~/controllers/groupController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { groupValidation } from '~/validations/groupValidation'

const Router = express.Router()

Router.route('/getAllGroupAndMembers').get(groupController.getAllGroupAndMembers)

Router.route('/getGroupAndMembers/:groupId').get(groupController.getGroupAndMembers)

Router.route('/').get(groupController.getAllGroups).post(groupValidation.createNew, groupController.createNew)


Router.route('/:groupId').get(groupController.getGroupById)

export const groupRoute = Router
