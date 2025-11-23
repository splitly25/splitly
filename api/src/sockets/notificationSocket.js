let ioInstance = null

export const notificationSocket = (socket) => {
  // User joins their personal notification room
  socket.on('FE_JOIN_NOTIFICATION_ROOM', (userId) => {
    socket.join(`user_${userId}`)
    // console.log(`User ${userId} joined notification room`)
  })

  // User leaves notification room
  socket.on('FE_LEAVE_NOTIFICATION_ROOM', (userId) => {
    socket.leave(`user_${userId}`)
    // console.log(`User ${userId} left notification room`)
  })

  // Mark notification as read
  socket.on('FE_MARK_NOTIFICATION_READ', (data) => {
    // Broadcast to other devices of the same user
    socket.to(`user_${data.userId}`).emit('BE_NOTIFICATION_READ', data)
  })

  // Mark all notifications as read
  socket.on('FE_MARK_ALL_NOTIFICATIONS_READ', (userId) => {
    socket.to(`user_${userId}`).emit('BE_ALL_NOTIFICATIONS_READ', { userId })
  })
}

export const setIoInstance = (io) => {
  ioInstance = io
}

export const getIoInstance = () => {
  return ioInstance
}

export const emitNotificationToUser = (userId, notification) => {
  if (ioInstance) {
    ioInstance.to(`user_${userId}`).emit('BE_NEW_NOTIFICATION', notification)
  }
}

export const emitNotificationToUsers = (userIds, notification) => {
  if (ioInstance) {
    userIds.forEach((userId) => {
      ioInstance.to(`user_${userId}`).emit('BE_NEW_NOTIFICATION', {
        ...notification,
        recipientId: userId,
      })
    })
  }
}

export const emitUnreadCountUpdate = (userId, count) => {
  if (ioInstance) {
    ioInstance.to(`user_${userId}`).emit('BE_UNREAD_COUNT_UPDATE', { count })
  }
}
