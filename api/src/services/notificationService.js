/* eslint-disable no-useless-catch */
import { notificationModel } from '~/models/notificationModel.js'
import { emitNotificationToUser, emitNotificationToUsers, emitUnreadCountUpdate } from '~/sockets/notificationSocket.js'

const { NOTIFICATION_TYPES, RESOURCE_TYPES } = notificationModel

/**
 * Create and send a notification
 */
const createNotification = async (data) => {
  try {
    const notification = await notificationModel.createNew(data)
    // Emit real-time notification
    emitNotificationToUser(data.recipientId.toString(), notification)
    return notification
  } catch (error) {
    console.warn('Failed to create notification:', error.message)
    return null
  }
}

/**
 * Create notifications for multiple recipients
 */
const createNotificationsForMany = async (recipientIds, baseData) => {
  try {
    if (!recipientIds || recipientIds.length === 0) return null

    const notifications = recipientIds.map(recipientId => ({
      ...baseData,
      recipientId
    }))

    const result = await notificationModel.createMany(notifications)
    // Emit real-time notifications
    emitNotificationToUsers(recipientIds.map(id => id.toString()), baseData)
    return result
  } catch (error) {
    console.warn('Failed to create notifications:', error.message)
    return null
  }
}

/**
 * Get notifications for a user
 */
const getNotifications = async (userId, filters = {}) => {
  try {
    return await notificationModel.getNotificationsByUser(userId, filters)
  } catch (error) {
    throw error
  }
}

/**
 * Get notification counts
 */
const getCounts = async (userId) => {
  try {
    const [total, unread] = await Promise.all([
      notificationModel.getTotalCount(userId),
      notificationModel.getUnreadCount(userId)
    ])
    return { total, unread }
  } catch (error) {
    throw error
  }
}

/**
 * Mark notification as read
 */
const markAsRead = async (notificationId, userId) => {
  try {
    const result = await notificationModel.markAsRead(notificationId)
    // Update unread count via socket
    const unread = await notificationModel.getUnreadCount(userId)
    emitUnreadCountUpdate(userId, unread)
    return result
  } catch (error) {
    throw error
  }
}

/**
 * Mark all as read
 */
const markAllAsRead = async (userId) => {
  try {
    const result = await notificationModel.markAllAsRead(userId)
    emitUnreadCountUpdate(userId, 0)
    return result
  } catch (error) {
    throw error
  }
}

/**
 * Delete notification
 */
const deleteNotification = async (notificationId) => {
  try {
    return await notificationModel.deleteOneById(notificationId)
  } catch (error) {
    throw error
  }
}

// ============ Bill Notification Helpers ============

const notifyBillAdded = async (actorId, actorName, recipientIds, billId, billName, amount) => {
  return await createNotificationsForMany(recipientIds, {
    actorId,
    type: NOTIFICATION_TYPES.BILL_ADDED,
    resourceType: RESOURCE_TYPES.BILL,
    resourceId: billId,
    title: 'New Bill',
    message: `${actorName} added you to bill "${billName}" - ${amount.toLocaleString()}đ`
  })
}

const notifyBillUpdated = async (actorId, actorName, recipientIds, billId, billName) => {
  return await createNotificationsForMany(recipientIds, {
    actorId,
    type: NOTIFICATION_TYPES.BILL_UPDATED,
    resourceType: RESOURCE_TYPES.BILL,
    resourceId: billId,
    title: 'Bill Updated',
    message: `${actorName} updated bill "${billName}"`
  })
}

const notifyBillDeleted = async (actorId, actorName, recipientIds, billId, billName) => {
  return await createNotificationsForMany(recipientIds, {
    actorId,
    type: NOTIFICATION_TYPES.BILL_DELETED,
    resourceType: RESOURCE_TYPES.BILL,
    resourceId: billId,
    title: 'Bill Deleted',
    message: `${actorName} deleted bill "${billName}"`
  })
}

const notifyBillReminder = async (actorId, actorName, recipientId, billId, billName, amount) => {
  return await createNotification({
    actorId,
    recipientId,
    type: NOTIFICATION_TYPES.BILL_REMINDER,
    resourceType: RESOURCE_TYPES.BILL,
    resourceId: billId,
    title: 'Payment Reminder',
    message: `${actorName} reminded you to pay ${amount.toLocaleString()}đ for "${billName}"`
  })
}

const notifyBillSettled = async (actorId, actorName, recipientIds, billId, billName) => {
  return await createNotificationsForMany(recipientIds, {
    actorId,
    type: NOTIFICATION_TYPES.BILL_SETTLED,
    resourceType: RESOURCE_TYPES.BILL,
    resourceId: billId,
    title: 'Bill Settled',
    message: `Bill "${billName}" has been fully settled`
  })
}

// ============ Payment Notification Helpers ============

const notifyPaymentInitiated = async (actorId, actorName, recipientId, billId, amount) => {
  return await createNotification({
    actorId,
    recipientId,
    type: NOTIFICATION_TYPES.PAYMENT_INITIATED,
    resourceType: RESOURCE_TYPES.BILL,
    resourceId: billId,
    title: 'Payment Initiated',
    message: `${actorName} initiated a payment of ${amount.toLocaleString()}đ`
  })
}

const notifyPaymentReceived = async (actorId, actorName, recipientId, billId, amount) => {
  return await createNotification({
    actorId,
    recipientId,
    type: NOTIFICATION_TYPES.PAYMENT_RECEIVED,
    resourceType: RESOURCE_TYPES.BILL,
    resourceId: billId,
    title: 'Payment Received',
    message: `${actorName} paid you ${amount.toLocaleString()}đ`
  })
}

const notifyPaymentConfirmed = async (actorId, actorName, recipientId, billId, amount) => {
  return await createNotification({
    actorId,
    recipientId,
    type: NOTIFICATION_TYPES.PAYMENT_CONFIRMED,
    resourceType: RESOURCE_TYPES.BILL,
    resourceId: billId,
    title: 'Payment Confirmed',
    message: `${actorName} confirmed your payment of ${amount.toLocaleString()}đ`
  })
}

const notifyPaymentRejected = async (actorId, actorName, recipientId, billId, amount, reason = '') => {
  return await createNotification({
    actorId,
    recipientId,
    type: NOTIFICATION_TYPES.PAYMENT_REJECTED,
    resourceType: RESOURCE_TYPES.BILL,
    resourceId: billId,
    title: 'Payment Rejected',
    message: `${actorName} rejected your payment of ${amount.toLocaleString()}đ${reason ? `: ${reason}` : ''}`
  })
}

// ============ Group Notification Helpers ============

const notifyGroupInvited = async (actorId, actorName, recipientIds, groupId, groupName) => {
  // Support both single recipient (string) and multiple recipients (array)
  if (Array.isArray(recipientIds)) {
    return await createNotificationsForMany(recipientIds, {
      actorId,
      type: NOTIFICATION_TYPES.GROUP_INVITED,
      resourceType: RESOURCE_TYPES.GROUP,
      resourceId: groupId,
      title: 'Group Invitation',
      message: `${actorName} added you to group "${groupName}"`
    })
  }
  return await createNotification({
    actorId,
    recipientId: recipientIds,
    type: NOTIFICATION_TYPES.GROUP_INVITED,
    resourceType: RESOURCE_TYPES.GROUP,
    resourceId: groupId,
    title: 'Group Invitation',
    message: `${actorName} added you to group "${groupName}"`
  })
}

const notifyGroupUpdated = async (actorId, actorName, recipientIds, groupId, groupName) => {
  return await createNotificationsForMany(recipientIds, {
    actorId,
    type: NOTIFICATION_TYPES.GROUP_UPDATED,
    resourceType: RESOURCE_TYPES.GROUP,
    resourceId: groupId,
    title: 'Group Updated',
    message: `${actorName} updated group "${groupName}"`
  })
}

const notifyGroupDeleted = async (actorId, actorName, recipientIds, groupId, groupName) => {
  return await createNotificationsForMany(recipientIds, {
    actorId,
    type: NOTIFICATION_TYPES.GROUP_DELETED,
    resourceType: RESOURCE_TYPES.GROUP,
    resourceId: groupId,
    title: 'Group Deleted',
    message: `${actorName} deleted group "${groupName}"`
  })
}

const notifyGroupMemberAdded = async (actorId, actorName, recipientIds, groupId, groupName, newMemberName) => {
  return await createNotificationsForMany(recipientIds, {
    actorId,
    type: NOTIFICATION_TYPES.GROUP_MEMBER_ADDED,
    resourceType: RESOURCE_TYPES.GROUP,
    resourceId: groupId,
    title: 'New Group Member',
    message: `${actorName} added ${newMemberName} to group "${groupName}"`
  })
}

const notifyGroupMemberRemoved = async (actorId, actorName, recipientId, groupId, groupName) => {
  return await createNotification({
    actorId,
    recipientId,
    type: NOTIFICATION_TYPES.GROUP_MEMBER_REMOVED,
    resourceType: RESOURCE_TYPES.GROUP,
    resourceId: groupId,
    title: 'Removed from Group',
    message: `${actorName} removed you from group "${groupName}"`
  })
}

const notifyGroupBillAdded = async (actorId, actorName, recipientIds, groupId, groupName, billName) => {
  return await createNotificationsForMany(recipientIds, {
    actorId,
    type: NOTIFICATION_TYPES.GROUP_BILL_ADDED,
    resourceType: RESOURCE_TYPES.GROUP,
    resourceId: groupId,
    title: 'New Bill in Group',
    message: `${actorName} added bill "${billName}" to group "${groupName}"`
  })
}

export const notificationService = {
  // Core
  createNotification,
  createNotificationsForMany,
  getNotifications,
  getCounts,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  // Bill
  notifyBillAdded,
  notifyBillUpdated,
  notifyBillDeleted,
  notifyBillReminder,
  notifyBillSettled,
  // Payment
  notifyPaymentInitiated,
  notifyPaymentReceived,
  notifyPaymentConfirmed,
  notifyPaymentRejected,
  // Group
  notifyGroupInvited,
  notifyGroupUpdated,
  notifyGroupDeleted,
  notifyGroupMemberAdded,
  notifyGroupMemberRemoved,
  notifyGroupBillAdded
}
