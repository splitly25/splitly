import { StatusCodes } from 'http-status-codes'
import { notificationService } from '~/services/notificationService.js'

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { limit = 20, offset = 0, unreadOnly = false } = req.query

    const notifications = await notificationService.getNotifications(userId, {
      limit: parseInt(limit),
      offset: parseInt(offset),
      unreadOnly: unreadOnly === 'true'
    })

    const counts = await notificationService.getCounts(userId)

    res.status(StatusCodes.OK).json({
      notifications,
      total: counts.total,
      unread: counts.unread,
      hasMore: parseInt(offset) + notifications.length < counts.total
    })
  } catch (error) {
    next(error)
  }
}

const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const counts = await notificationService.getCounts(userId)

    res.status(StatusCodes.OK).json({
      total: counts.total,
      unread: counts.unread
    })
  } catch (error) {
    next(error)
  }
}

const markAsRead = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { notificationId } = req.params

    const result = await notificationService.markAsRead(notificationId, userId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id

    await notificationService.markAllAsRead(userId)

    res.status(StatusCodes.OK).json({ message: 'All notifications marked as read' })
  } catch (error) {
    next(error)
  }
}

const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params

    await notificationService.deleteNotification(notificationId)

    res.status(StatusCodes.NO_CONTENT).send()
  } catch (error) {
    next(error)
  }
}

export const notificationController = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
}
