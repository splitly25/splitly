import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/').get(authMiddleware.isAuthorized, userValidation.fetchUsers, userController.fetchUsers)

Router.route('/register').post(userValidation.createNew, userController.createNew)

Router.route('/verify_account').put(userValidation.verifyAccount, userController.verifyAccount)

Router.route('/login').post(userValidation.login, userController.login)

Router.route('/logout').delete(authMiddleware.isAuthorized, userController.logout)

Router.route('/:userId').get(authMiddleware.isAuthorized, userController.getUserById)

Router.route('/email/:email').get(authMiddleware.isAuthorized, userController.getUserByEmail)

Router.route('/:userId/profile').put(authMiddleware.isAuthorized, userController.editProfile)

Router.route('/guest').post(userValidation.createGuestUser, userController.createGuestUser)

export const userRoute = Router
