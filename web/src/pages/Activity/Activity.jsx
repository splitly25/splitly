import Layout from '~/components/Layout'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  IconButton,
  FormControlLabel,
  CircularProgress,
} from '@mui/material'
import {
  FilterList as FilterListIcon,
  Receipt as ReceiptIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Payment as PaymentIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  Cancel as CancelIcon,
  AddCircle as AddCircleIcon,
  Close as CloseIcon,
  DoneAll as DoneAllIcon,
} from '@mui/icons-material'
import { COLORS } from '~/theme'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import {
  fetchNotificationsAPI,
  markNotificationReadAPI,
  markAllNotificationsReadAPI,
  addNotification,
  setNotificationRead,
  setAllNotificationsRead,
  setUnreadCount,
  selectCurrentNotifications,
  selectNotificationTotal,
  selectUnreadCount,
  selectHasMore,
  selectNotificationLoading,
  selectNotificationLoadingMore,
} from '~/redux/notification/notificationSlice'
import { formatDate, formatDateTime } from '~/utils/formatters'
import { socketIoInstance } from '~/main'
import { toast } from 'react-toastify'
import Container from '@mui/material/Container'

// Helper function to get navigation path based on notification
const getNavigationPath = (notification) => {
  const { resourceType, resourceId, type } = notification

  // Don't navigate for deleted resources
  if (type?.includes('deleted')) {
    return null
  }

  switch (resourceType) {
    case 'bill':
      return `/bills/${resourceId}`
    case 'group':
      return `/groups/${resourceId}`
    case 'user':
      // For payment activities, navigate to debt page
      return '/debt'
    default:
      return null
  }
}

// Notification type configurations based on new NOTIFICATION_TYPES
const notificationTypeConfig = {
  // Bill notifications
  bill_added: {
    icon: ReceiptIcon,
    color: '#EF9A9A',
  },
  bill_updated: {
    icon: EditIcon,
    color: '#FF9800',
  },
  bill_deleted: {
    icon: DeleteIcon,
    color: '#f44336',
  },
  bill_reminder: {
    icon: NotificationsIcon,
    color: '#FF5722',
  },
  bill_settled: {
    icon: CheckCircleIcon,
    color: '#4CAF50',
  },

  // Payment notifications
  payment_received: {
    icon: PaymentIcon,
    color: '#2196F3',
  },
  payment_confirmed: {
    icon: CheckCircleIcon,
    color: '#4CAF50',
  },
  payment_rejected: {
    icon: CancelIcon,
    color: '#f44336',
  },
  payment_initiated: {
    icon: PaymentIcon,
    color: '#2196F3',
  },

  // Group notifications
  group_invited: {
    icon: GroupIcon,
    color: '#9C27B0',
  },
  group_updated: {
    icon: EditIcon,
    color: '#9C27B0',
  },
  group_deleted: {
    icon: DeleteIcon,
    color: '#f44336',
  },
  group_bill_added: {
    icon: AddCircleIcon,
    color: '#4CAF50',
  },
  group_member_added: {
    icon: PersonAddIcon,
    color: '#00BCD4',
  },
  group_member_removed: {
    icon: PersonRemoveIcon,
    color: '#FF5722',
  },
}

// Notification type checkbox options for filter dialog
const notificationTypeCheckboxOptions = [
  // Bill notifications
  { value: 'bill_added', label: 'Thêm hóa đơn', category: 'bill' },
  { value: 'bill_updated', label: 'Cập nhật hóa đơn', category: 'bill' },
  { value: 'bill_deleted', label: 'Xóa hóa đơn', category: 'bill' },
  { value: 'bill_reminder', label: 'Nhắc nhở hóa đơn', category: 'bill' },
  { value: 'bill_settled', label: 'Quyết toán hóa đơn', category: 'bill' },
  // Payment notifications
  { value: 'payment_received', label: 'Nhận thanh toán', category: 'payment' },
  { value: 'payment_confirmed', label: 'Xác nhận thanh toán', category: 'payment' },
  { value: 'payment_rejected', label: 'Từ chối thanh toán', category: 'payment' },
  { value: 'payment_initiated', label: 'Khởi tạo thanh toán', category: 'payment' },
  // Group notifications
  { value: 'group_invited', label: 'Mời vào nhóm', category: 'group' },
  { value: 'group_updated', label: 'Cập nhật nhóm', category: 'group' },
  { value: 'group_deleted', label: 'Xóa nhóm', category: 'group' },
  { value: 'group_bill_added', label: 'Thêm hóa đơn vào nhóm', category: 'group' },
  { value: 'group_member_added', label: 'Thêm thành viên', category: 'group' },
  { value: 'group_member_removed', label: 'Xóa thành viên', category: 'group' },
]

// All notification types array
const allNotificationTypes = notificationTypeCheckboxOptions.map((opt) => opt.value)

// Group notifications by date
const groupNotificationsByDate = (notifications) => {
  const grouped = {}
  notifications.forEach((notification) => {
    const dateKey = formatDate(notification.createdAt)
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(notification)
  })
  // Sort by date descending
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('-'))
    const dateB = new Date(b.split('/').reverse().join('-'))
    return dateB - dateA
  })
  return sortedKeys.map((date) => ({
    date,
    notifications: grouped[date].sort((a, b) => b.createdAt - a.createdAt),
  }))
}

// Notification Card Component
const NotificationCard = ({ notification, onMarkAsRead }) => {
  const navigate = useNavigate()
  const config = notificationTypeConfig[notification.type] || {
    icon: ReceiptIcon,
    color: '#757575',
  }
  const IconComponent = config.icon

  // Get navigation path
  const navigationPath = getNavigationPath(notification)
  const isClickable = navigationPath !== null

  // Handle card click
  const handleCardClick = async () => {
    // Mark as read if not already read
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification._id)
    }
    if (isClickable) {
      navigate(navigationPath)
    }
  }

  return (
    <Box sx={{ position: 'relative', pl: 4 }}>
      {/* Timeline icon */}
      <Box
        sx={{
          position: 'absolute',
          left: -32,
          top: 8,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0px 10px 15px 0px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <IconComponent sx={{ fontSize: 20, color: config.color }} />
      </Box>

      {/* Notification Card */}
      <Card
        onClick={handleCardClick}
        sx={{
          borderRadius: '16px',
          border: '1px solid',
          borderColor: notification.isRead ? 'divider' : 'primary.main',
          p: 3,
          backgroundColor: notification.isRead ? '#ffffff' : 'rgba(206, 147, 216, 0.05)',
          cursor: isClickable ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          '&:hover': isClickable
            ? {
                borderColor: 'primary.main',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
              }
            : {},
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Content */}
          <Box sx={{ flex: 1 }}>
            {/* Header with title and timestamp */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: notification.message ? 1 : 0,
              }}
            >
              <Typography
                sx={{
                  fontWeight: notification.isRead ? 500 : 600,
                  fontSize: '14px',
                  color: 'text.primary',
                }}
              >
                {notification.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {!notification.isRead && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: COLORS.gradientPrimary,
                    }}
                  />
                )}
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatDateTime(notification.createdAt)}
                </Typography>
              </Box>
            </Box>

            {/* Message */}
            {notification.message && (
              <Typography
                sx={{
                  fontSize: '14px',
                  color: 'text.secondary',
                }}
              >
                {notification.message}
              </Typography>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

// Date Group Component
const DateGroup = ({ date, notifications, isLast, onMarkAsRead }) => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Date Badge with line */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box
          sx={{
            background: COLORS.gradientPrimary,
            borderRadius: '16px',
            px: 1.5,
            py: 0.5,
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '12px',
              color: '#fff',
            }}
          >
            {date}
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            height: '1px',
            backgroundColor: 'divider',
          }}
        />
      </Box>

      {/* Notifications with timeline */}
      <Box sx={{ position: 'relative', ml: 2.25 }}>
        {/* Vertical timeline line */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: isLast ? 48 : 0,
            width: 2,
            background: COLORS.gradientPrimary,
          }}
        />

        {/* Notification cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {notifications.map((notification) => (
            <NotificationCard key={notification._id} notification={notification} onMarkAsRead={onMarkAsRead} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// Pagination config
const ITEMS_PER_PAGE = 10

const Activity = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  // Redux state
  const notifications = useSelector(selectCurrentNotifications)
  const total = useSelector(selectNotificationTotal)
  const unreadCount = useSelector(selectUnreadCount)
  const hasMore = useSelector(selectHasMore)
  const loading = useSelector(selectNotificationLoading)
  const loadingMore = useSelector(selectNotificationLoadingMore)

  // Filter dialog state
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [selectedNotificationTypes, setSelectedNotificationTypes] = useState(allNotificationTypes)
  const [tempSelectedTypes, setTempSelectedTypes] = useState(allNotificationTypes)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [tempDateFrom, setTempDateFrom] = useState('')
  const [tempDateTo, setTempDateTo] = useState('')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [tempUnreadOnly, setTempUnreadOnly] = useState(false)

  // Pagination state
  const [offset, setOffset] = useState(0)

  // Fetch notifications from API
  const fetchNotifications = useCallback(
    (isLoadMore = false) => {
      if (!currentUser?._id) return

      const newOffset = isLoadMore ? offset + ITEMS_PER_PAGE : 0
      dispatch(fetchNotificationsAPI({ limit: ITEMS_PER_PAGE, offset: newOffset, unreadOnly }))
      if (isLoadMore) {
        setOffset(newOffset)
      } else {
        setOffset(0)
      }
    },
    [currentUser?._id, dispatch, offset, unreadOnly]
  )

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchNotifications(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, unreadOnly])

  // Socket.io listeners for real-time updates
  useEffect(() => {
    if (!currentUser?._id) return

    // Join notification room
    socketIoInstance.emit('FE_JOIN_NOTIFICATION_ROOM', currentUser._id)

    // Listen for new notifications
    const handleNewNotification = (notification) => {
      // Only add if notification is for current user
      if (notification?.recipientId === currentUser._id) {
        dispatch(addNotification(notification))

        // Show toast notification
        toast.info(notification.title || 'Bạn có thông báo mới', { theme: 'colored' })
      }
    }

    // Listen for notification read (from other devices)
    const handleNotificationRead = ({ notificationId, userId }) => {
      if (userId === currentUser._id) {
        dispatch(setNotificationRead({ notificationId }))
      }
    }

    // Listen for all notifications read (from other devices)
    const handleAllNotificationsRead = ({ userId }) => {
      if (userId === currentUser._id) {
        dispatch(setAllNotificationsRead())
      }
    }

    // Listen for unread count update
    const handleUnreadCountUpdate = ({ userId, count }) => {
      if (userId === currentUser._id) {
        dispatch(setUnreadCount(count))
      }
    }

    socketIoInstance.on('BE_NEW_NOTIFICATION', handleNewNotification)
    socketIoInstance.on('BE_NOTIFICATION_READ', handleNotificationRead)
    socketIoInstance.on('BE_ALL_NOTIFICATIONS_READ', handleAllNotificationsRead)
    socketIoInstance.on('BE_UNREAD_COUNT_UPDATE', handleUnreadCountUpdate)

    // Cleanup on unmount
    return () => {
      socketIoInstance.emit('FE_LEAVE_NOTIFICATION_ROOM', currentUser._id)
      socketIoInstance.off('BE_NEW_NOTIFICATION', handleNewNotification)
      socketIoInstance.off('BE_NOTIFICATION_READ', handleNotificationRead)
      socketIoInstance.off('BE_ALL_NOTIFICATIONS_READ', handleAllNotificationsRead)
      socketIoInstance.off('BE_UNREAD_COUNT_UPDATE', handleUnreadCountUpdate)
    }
  }, [currentUser?._id, dispatch])

  // Group notifications by date
  const groupedNotifications = groupNotificationsByDate(notifications)

  // Handle mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    dispatch(markNotificationReadAPI(notificationId))
    // Emit socket event to sync across devices
    socketIoInstance.emit('FE_MARK_NOTIFICATION_READ', { notificationId, userId: currentUser._id })
  }

  // Handle mark all notifications as read
  const handleMarkAllAsRead = async () => {
    dispatch(markAllNotificationsReadAPI())
    // Emit socket event to sync across devices
    socketIoInstance.emit('FE_MARK_ALL_NOTIFICATIONS_READ', currentUser._id)
  }

  // Handle filter dialog open
  const handleFilterClick = () => {
    setTempSelectedTypes(selectedNotificationTypes)
    setTempDateFrom(dateFrom)
    setTempDateTo(dateTo)
    setTempUnreadOnly(unreadOnly)
    setFilterDialogOpen(true)
  }

  // Handle filter dialog close
  const handleFilterClose = () => {
    setFilterDialogOpen(false)
  }

  // Handle notification type checkbox change
  const handleNotificationTypeChange = (typeValue) => {
    setTempSelectedTypes((prev) =>
      prev.includes(typeValue) ? prev.filter((t) => t !== typeValue) : [...prev, typeValue]
    )
  }

  // Handle deselect all notification types
  const handleDeselectAll = () => {
    setTempSelectedTypes([])
  }

  // Handle select all notification types
  const handleSelectAll = () => {
    setTempSelectedTypes(allNotificationTypes)
  }

  // Handle apply filters
  const handleApplyFilters = () => {
    setSelectedNotificationTypes(tempSelectedTypes.length > 0 ? tempSelectedTypes : allNotificationTypes)
    setDateFrom(tempDateFrom)
    setDateTo(tempDateTo)
    setUnreadOnly(tempUnreadOnly)
    setOffset(0) // Reset pagination on filter change
    setFilterDialogOpen(false)
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setTempSelectedTypes(allNotificationTypes)
    setTempDateFrom('')
    setTempDateTo('')
    setTempUnreadOnly(false)
  }

  // Handle load more
  const handleLoadMore = () => {
    fetchNotifications(true)
  }

  // Check if any filters are active
  const hasActiveFilters =
    selectedNotificationTypes.length !== allNotificationTypes.length || dateFrom !== '' || dateTo !== '' || unreadOnly

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            minHeight: '100vh',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: { xs: '24px', md: '30px' },
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                Thông báo
              </Typography>
              <Typography
                sx={{
                  fontSize: '16px',
                  color: 'text.secondary',
                }}
              >
                Theo dõi tất cả thông báo và cập nhật
              </Typography>
            </Box>

            {/* Filter Button */}
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              sx={{
                borderRadius: '16px',
                borderColor: hasActiveFilters ? 'primary.main' : 'divider',
                color: hasActiveFilters ? 'primary.main' : 'text.primary',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '14px',
                px: 2,
                py: 1,
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Lọc thông báo
              {hasActiveFilters && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: COLORS.gradientPrimary,
                  }}
                />
              )}
            </Button>
          </Box>

          {/* Filter Dialog */}
          <Dialog
            open={filterDialogOpen}
            onClose={handleFilterClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '24px',
                  p: 0,
                  maxWidth: 480,
                },
              },
            }}
          >
            {/* Dialog Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 3,
                pb: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '20px',
                  color: 'text.primary',
                }}
              >
                Lọc thông báo
              </Typography>
              <IconButton onClick={handleFilterClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogContent sx={{ px: 3, py: 0 }}>
              {/* Date Range Section */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'text.primary',
                    mb: 1.5,
                  }}
                >
                  Khoảng thời gian
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'text.secondary',
                        mb: 0.5,
                      }}
                    >
                      Từ ngày
                    </Typography>
                    <Box
                      component="input"
                      type="date"
                      value={tempDateFrom}
                      onChange={(e) => setTempDateFrom(e.target.value)}
                      sx={{
                        width: '100%',
                        px: 1.5,
                        py: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        '&:focus': {
                          borderColor: 'primary.main',
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'text.secondary',
                        mb: 0.5,
                      }}
                    >
                      Đến ngày
                    </Typography>
                    <Box
                      component="input"
                      type="date"
                      value={tempDateTo}
                      onChange={(e) => setTempDateTo(e.target.value)}
                      sx={{
                        width: '100%',
                        px: 1.5,
                        py: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontFamily: 'inherit',
                        outline: 'none',
                        '&:focus': {
                          borderColor: 'primary.main',
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Unread Only Filter */}
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tempUnreadOnly}
                      onChange={(e) => setTempUnreadOnly(e.target.checked)}
                      size="small"
                      sx={{
                        color: 'text.secondary',
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  }
                  label="Chỉ hiển thị chưa đọc"
                  sx={{
                    m: 0,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '14px',
                      color: 'text.primary',
                    },
                  }}
                />
              </Box>

              {/* Notification Types Section */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: '14px',
                      color: 'text.primary',
                    }}
                  >
                    Loại thông báo
                  </Typography>
                  <Button
                    onClick={
                      tempSelectedTypes.length === allNotificationTypes.length ? handleDeselectAll : handleSelectAll
                    }
                    sx={{
                      textTransform: 'none',
                      fontSize: '12px',
                      color: 'primary.main',
                      fontWeight: 500,
                      minWidth: 'auto',
                      p: 0,
                      '&:hover': {
                        background: 'transparent',
                      },
                    }}
                  >
                    {tempSelectedTypes.length === allNotificationTypes.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </Button>
                </Box>

                {/* Notification Type Checkboxes Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 0.5,
                  }}
                >
                  {notificationTypeCheckboxOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox
                          checked={tempSelectedTypes.includes(option.value)}
                          onChange={() => handleNotificationTypeChange(option.value)}
                          size="small"
                          sx={{
                            color: 'text.secondary',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                          }}
                        />
                      }
                      label={option.label}
                      sx={{
                        m: 0,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '13px',
                          color: 'text.primary',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </DialogContent>

            {/* Dialog Footer */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                p: 3,
                pt: 2,
              }}
            >
              <Button
                onClick={handleClearFilters}
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: '16px',
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'text.secondary',
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Xóa bộ lọc
              </Button>
              <Button
                onClick={handleApplyFilters}
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: '16px',
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  background: COLORS.gradientPrimary,
                  color: '#fff',
                  boxShadow: 'none',
                  '&:hover': {
                    background: COLORS.gradientPrimary,
                    opacity: 0.9,
                    boxShadow: 'none',
                  },
                }}
              >
                Áp dụng
              </Button>
            </Box>
          </Dialog>

          {/* Notification List */}
          <Box sx={{ maxWidth: 960, mx: 'auto' }}>
            {/* Mark All as Read Button */}
            {unreadCount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  onClick={handleMarkAllAsRead}
                  startIcon={<DoneAllIcon />}
                  sx={{
                    textTransform: 'none',
                    fontSize: '14px',
                    color: 'primary.main',
                    fontWeight: 500,
                    '&:hover': {
                      background: 'rgba(206, 147, 216, 0.1)',
                    },
                  }}
                >
                  Đánh dấu tất cả đã đọc ({unreadCount})
                </Button>
              </Box>
            )}

            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 8,
                }}
              >
                <CircularProgress sx={{ color: '#CE93D8' }} />
              </Box>
            ) : groupedNotifications.length > 0 ? (
              <>
                {groupedNotifications.map((group, index) => (
                  <DateGroup
                    key={group.date}
                    date={group.date}
                    notifications={group.notifications}
                    isLast={index === groupedNotifications.length - 1 && !hasMore}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                    <Button
                      onClick={handleLoadMore}
                      variant="outlined"
                      disabled={loadingMore}
                      sx={{
                        borderRadius: '16px',
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '14px',
                        borderColor: 'divider',
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      {loadingMore ? <CircularProgress size={20} sx={{ color: '#CE93D8', mr: 1 }} /> : null}
                      Tải thêm ({total - notifications.length} thông báo còn lại)
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '16px',
                    color: 'text.secondary',
                  }}
                >
                  Không có thông báo nào
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Layout>
  )
}

export default Activity
