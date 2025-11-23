import express from 'express'
import { notificationController } from '~/controllers/notificationController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// GET /api/v1/notifications - Get user notifications
Router.get('/', authMiddleware.isAuthorized, notificationController.getNotifications)

// GET /api/v1/notifications/count - Get unread count
Router.get('/count', authMiddleware.isAuthorized, notificationController.getUnreadCount)

// PUT /api/v1/notifications/read-all - Mark all as read
Router.put('/read-all', authMiddleware.isAuthorized, notificationController.markAllAsRead)

// PUT /api/v1/notifications/:notificationId/read - Mark single as read
Router.put('/:notificationId/read', authMiddleware.isAuthorized, notificationController.markAsRead)

// DELETE /api/v1/notifications/:notificationId - Delete notification
Router.delete('/:notificationId', authMiddleware.isAuthorized, notificationController.deleteNotification)

export const notificationRoute = Router
