import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const initialState = {
  currentNotifications: [],
  total: 0,
  unreadCount: 0,
  hasMore: false,
  loading: false,
  loadingMore: false,
}

// Fetch notifications with pagination
export const fetchNotificationsAPI = createAsyncThunk(
  'notifications/fetchNotificationsAPI',
  async ({ limit = 10, offset = 0, unreadOnly = false } = {}) => {
    const params = new URLSearchParams({ limit, offset })
    if (unreadOnly) params.append('unreadOnly', true)
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/notifications?${params.toString()}`)
    return { ...response.data, offset }
  }
)

// Mark single notification as read
export const markNotificationReadAPI = createAsyncThunk(
  'notifications/markNotificationReadAPI',
  async (notificationId) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/notifications/${notificationId}/read`)
    return { notificationId, ...response.data }
  }
)

// Mark all notifications as read
export const markAllNotificationsReadAPI = createAsyncThunk(
  'notifications/markAllNotificationsReadAPI',
  async () => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/notifications/read-all`)
    return response.data
  }
)

// Delete notification
export const deleteNotificationAPI = createAsyncThunk(
  'notifications/deleteNotificationAPI',
  async (notificationId) => {
    await authorizedAxiosInstance.delete(`${API_ROOT}/v1/notifications/${notificationId}`)
    return notificationId
  }
)

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.currentNotifications = []
      state.total = 0
      state.unreadCount = 0
      state.hasMore = false
    },
    // Add new notification (from socket)
    addNotification: (state, action) => {
      const newNotification = action.payload
      // Add to beginning of list
      state.currentNotifications.unshift(newNotification)
      state.total += 1
      if (!newNotification.isRead) {
        state.unreadCount += 1
      }
    },
    // Update notification read status (from socket)
    setNotificationRead: (state, action) => {
      const { notificationId } = action.payload
      const notification = state.currentNotifications.find((n) => n._id === notificationId)
      if (notification && !notification.isRead) {
        notification.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    // Mark all as read (from socket)
    setAllNotificationsRead: (state) => {
      state.currentNotifications.forEach((n) => {
        n.isRead = true
      })
      state.unreadCount = 0
    },
    // Update unread count (from socket)
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotificationsAPI.pending, (state, action) => {
        const offset = action.meta.arg?.offset || 0
        if (offset === 0) {
          state.loading = true
        } else {
          state.loadingMore = true
        }
      })
      .addCase(fetchNotificationsAPI.fulfilled, (state, action) => {
        const { notifications, total, unread, hasMore, offset } = action.payload
        if (offset === 0) {
          state.currentNotifications = notifications
        } else {
          state.currentNotifications = [...state.currentNotifications, ...notifications]
        }
        state.total = total
        state.unreadCount = unread
        state.hasMore = hasMore
        state.loading = false
        state.loadingMore = false
      })
      .addCase(fetchNotificationsAPI.rejected, (state) => {
        state.loading = false
        state.loadingMore = false
      })

    // Mark notification as read
    builder.addCase(markNotificationReadAPI.fulfilled, (state, action) => {
      const { notificationId } = action.payload
      const notification = state.currentNotifications.find((n) => n._id === notificationId)
      if (notification && !notification.isRead) {
        notification.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    })

    // Mark all as read
    builder.addCase(markAllNotificationsReadAPI.fulfilled, (state) => {
      state.currentNotifications.forEach((n) => {
        n.isRead = true
      })
      state.unreadCount = 0
    })

    // Delete notification
    builder.addCase(deleteNotificationAPI.fulfilled, (state, action) => {
      const notificationId = action.payload
      const index = state.currentNotifications.findIndex((n) => n._id === notificationId)
      if (index !== -1) {
        const notification = state.currentNotifications[index]
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        state.currentNotifications.splice(index, 1)
        state.total = Math.max(0, state.total - 1)
      }
    })
  },
})

export const {
  clearNotifications,
  addNotification,
  setNotificationRead,
  setAllNotificationsRead,
  setUnreadCount,
} = notificationSlice.actions

// Selectors
export const selectCurrentNotifications = (state) => state.notifications.currentNotifications
export const selectNotificationTotal = (state) => state.notifications.total
export const selectUnreadCount = (state) => state.notifications.unreadCount
export const selectHasMore = (state) => state.notifications.hasMore
export const selectNotificationLoading = (state) => state.notifications.loading
export const selectNotificationLoadingMore = (state) => state.notifications.loadingMore

export const notificationReducer = notificationSlice.reducer
