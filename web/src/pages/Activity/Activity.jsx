import Layout from '~/components/Layout'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Avatar,
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
  ExitToApp as ExitToAppIcon,
  AccountBalanceWallet as WalletIcon,
  Cancel as CancelIcon,
  AddCircle as AddCircleIcon,
  Close as CloseIcon,
} from '@mui/icons-material'
import { COLORS } from '~/theme'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { getUserActivitiesAPI } from '~/apis'
import { formatCurrency, formatDate, formatDateTime, getInitials } from '~/utils/formatters'

// Helper function to get navigation path based on activity
const getNavigationPath = (activity) => {
  const { resourceType, resourceId, activityType } = activity

  // Don't navigate for deleted resources
  if (activityType.includes('deleted')) {
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

// Activity type configurations based on activityModel.js ACTIVITY_TYPES
const activityTypeConfig = {
  // Bill activities
  bill_created: {
    icon: ReceiptIcon,
    label: 'đã tạo hóa đơn',
    color: '#EF9A9A',
  },
  bill_updated: {
    icon: EditIcon,
    label: 'đã cập nhật hóa đơn',
    color: '#FF9800',
  },
  bill_deleted: {
    icon: DeleteIcon,
    label: 'đã xóa hóa đơn',
    color: '#f44336',
  },
  bill_paid: {
    icon: CheckCircleIcon,
    label: 'đã thanh toán hóa đơn',
    color: '#4CAF50',
  },
  bill_settled: {
    icon: CheckCircleIcon,
    label: 'đã quyết toán hóa đơn',
    color: '#4CAF50',
  },
  bill_reminder_sent: {
    icon: NotificationsIcon,
    label: 'đã gửi nhắc nhở thanh toán',
    color: '#FF5722',
  },
  bill_user_opted_out: {
    icon: ExitToAppIcon,
    label: 'đã rời khỏi hóa đơn',
    color: '#9E9E9E',
  },

  // Payment activities
  payment_initiated: {
    icon: PaymentIcon,
    label: 'đã khởi tạo thanh toán cho',
    color: '#2196F3',
  },
  payment_confirmed: {
    icon: CheckCircleIcon,
    label: 'đã xác nhận thanh toán',
    color: '#4CAF50',
  },
  payment_rejected: {
    icon: CancelIcon,
    label: 'đã từ chối thanh toán',
    color: '#f44336',
  },

  // Debt activities
  debt_balanced: {
    icon: WalletIcon,
    label: 'đã cân bằng nợ',
    color: '#8BC34A',
  },

  // Group activities
  group_created: {
    icon: GroupIcon,
    label: 'đã tạo nhóm',
    color: '#2196F3',
  },
  group_updated: {
    icon: EditIcon,
    label: 'đã cập nhật nhóm',
    color: '#9C27B0',
  },
  group_deleted: {
    icon: DeleteIcon,
    label: 'đã xóa nhóm',
    color: '#f44336',
  },
  group_member_added: {
    icon: PersonAddIcon,
    label: 'đã thêm thành viên vào nhóm',
    color: '#00BCD4',
  },
  group_member_removed: {
    icon: PersonRemoveIcon,
    label: 'đã xóa thành viên khỏi nhóm',
    color: '#FF5722',
  },
  group_bill_added: {
    icon: AddCircleIcon,
    label: 'đã thêm hóa đơn vào nhóm',
    color: '#4CAF50',
  },
}

// Activity type checkbox options for filter dialog
const activityTypeCheckboxOptions = [
  // Bill activities
  { value: 'bill_created', label: 'Tạo hóa đơn', category: 'bill' },
  { value: 'bill_updated', label: 'Cập nhật hóa đơn', category: 'bill' },
  { value: 'bill_deleted', label: 'Xóa hóa đơn', category: 'bill' },
  { value: 'bill_paid', label: 'Thanh toán hóa đơn', category: 'bill' },
  { value: 'bill_settled', label: 'Quyết toán hóa đơn', category: 'bill' },
  { value: 'bill_reminder_sent', label: 'Gửi nhắc nhở', category: 'bill' },
  { value: 'bill_user_opted_out', label: 'Rời hóa đơn', category: 'bill' },
  // Payment activities
  { value: 'payment_initiated', label: 'Khởi tạo thanh toán', category: 'payment' },
  { value: 'payment_confirmed', label: 'Xác nhận thanh toán', category: 'payment' },
  { value: 'payment_rejected', label: 'Từ chối thanh toán', category: 'payment' },
  { value: 'debt_balanced', label: 'Cân bằng nợ', category: 'payment' },
  // Group activities
  { value: 'group_created', label: 'Tạo nhóm', category: 'group' },
  { value: 'group_updated', label: 'Cập nhật nhóm', category: 'group' },
  { value: 'group_deleted', label: 'Xóa nhóm', category: 'group' },
  { value: 'group_member_added', label: 'Thêm thành viên', category: 'group' },
  { value: 'group_member_removed', label: 'Xóa thành viên', category: 'group' },
  { value: 'group_bill_added', label: 'Thêm hóa đơn vào nhóm', category: 'group' },
]

// All activity types array
const allActivityTypes = activityTypeCheckboxOptions.map((opt) => opt.value)

// Group activities by date
const groupActivitiesByDate = (activities) => {
  const grouped = {}
  activities.forEach((activity) => {
    const dateKey = formatDate(activity.createdAt)
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(activity)
  })
  // Sort by date descending
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('-'))
    const dateB = new Date(b.split('/').reverse().join('-'))
    return dateB - dateA
  })
  return sortedKeys.map((date) => ({
    date,
    activities: grouped[date].sort((a, b) => b.createdAt - a.createdAt),
  }))
}

// Activity Card Component
const ActivityCard = ({ activity, currentUserId }) => {
  const navigate = useNavigate()
  const config = activityTypeConfig[activity.activityType] || {
    icon: ReceiptIcon,
    label: activity.activityType,
    color: '#757575',
  }
  const IconComponent = config.icon

  // Check if activity is by current user
  const isCurrentUser = activity.user?._id === currentUserId || activity.userId === currentUserId

  // Use user object from API response, fallback to details for backward compatibility
  const actualName = activity.user?.name || activity.details?.userName || activity.details?.debtorName || 'Người dùng'
  const userName = isCurrentUser ? 'Bạn' : actualName
  const userAvatar = activity.user?.avatar
  const initials = getInitials(actualName)

  // Check if activity has details to show
  const hasBillDetails = activity.resourceType === 'bill' && activity.details?.billName
  const hasGroupDetails = activity.resourceType === 'group' && activity.details?.groupName
  const hasPaymentDetails = activity.activityType === 'payment_initiated' && activity.details?.creditorName

  // Get navigation path
  const navigationPath = getNavigationPath(activity)
  const isClickable = navigationPath !== null

  // Handle card click
  const handleCardClick = () => {
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

      {/* Activity Card */}
      <Card
        onClick={handleCardClick}
        sx={{
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          p: 3,
          backgroundColor: '#ffffff',
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
          {/* User Avatar */}
          <Avatar
            src={userAvatar}
            sx={{
              width: 40,
              height: 40,
              background: COLORS.gradientPrimary,
              fontSize: '16px',
            }}
          >
            {initials}
          </Avatar>

          {/* Content */}
          <Box sx={{ flex: 1 }}>
            {/* Header with username, action, and timestamp */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: hasBillDetails || hasGroupDetails || hasPaymentDetails ? 1.5 : 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'text.primary',
                  }}
                >
                  {userName}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: '14px',
                    color: 'text.secondary',
                  }}
                >
                  {config.label}
                  {hasGroupDetails && ` "${activity.details.groupName}"`}
                  {hasPaymentDetails && (
                    <>
                      {' '}
                      <Typography component="span" sx={{ fontWeight: 600, fontSize: '14px', color: 'text.primary' }}>
                        {activity.details.creditorName}
                      </Typography>
                    </>
                  )}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: '12px',
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                  ml: 2,
                }}
              >
                {formatDateTime(activity.createdAt)}
              </Typography>
            </Box>

            {/* Bill Details Card */}
            {hasBillDetails && (
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '16px',
                  p: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '24px',
                      background: COLORS.gradientPrimary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ReceiptIcon sx={{ fontSize: 16, color: '#fff' }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: '14px',
                        color: 'text.primary',
                      }}
                    >
                      {activity.details.billName}
                    </Typography>
                    {activity.details.amount && (
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: 'text.secondary',
                        }}
                      >
                        {formatCurrency(activity.details.amount)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Payment Details Card */}
            {hasPaymentDetails && (
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '16px',
                  p: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '24px',
                      background: COLORS.gradientPrimary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PaymentIcon sx={{ fontSize: 16, color: '#fff' }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: '14px',
                        color: 'text.primary',
                      }}
                    >
                      Thanh toán cho {activity.details.creditorName}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: 'text.secondary',
                      }}
                    >
                      {formatCurrency(activity.details.amount)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

// Date Group Component
const DateGroup = ({ date, activities, isLast, currentUserId }) => {
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

      {/* Activities with timeline */}
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

        {/* Activity cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {activities.map((activity) => (
            <ActivityCard key={activity._id} activity={activity} currentUserId={currentUserId} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// Pagination config
const ITEMS_PER_PAGE = 10

const Activity = () => {
  const currentUser = useSelector(selectCurrentUser)

  // Data state
  const [activities, setActivities] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  // Filter dialog state
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [selectedActivityTypes, setSelectedActivityTypes] = useState(allActivityTypes)
  const [tempSelectedTypes, setTempSelectedTypes] = useState(allActivityTypes)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [tempDateFrom, setTempDateFrom] = useState('')
  const [tempDateTo, setTempDateTo] = useState('')

  // Pagination state
  const [offset, setOffset] = useState(0)

  // Fetch activities from API
  const fetchActivities = useCallback(
    async (isLoadMore = false) => {
      if (!currentUser?._id) return

      try {
        if (isLoadMore) {
          setLoadingMore(true)
        } else {
          setLoading(true)
        }

        const params = {
          limit: ITEMS_PER_PAGE,
          offset: isLoadMore ? offset + ITEMS_PER_PAGE : 0,
        }

        // Add activity types filter (only if not all selected)
        if (selectedActivityTypes.length !== allActivityTypes.length && selectedActivityTypes.length > 0) {
          params.types = selectedActivityTypes.join(',')
        }

        // Add date filters
        if (dateFrom) {
          params.dateFrom = new Date(dateFrom).setHours(0, 0, 0, 0)
        }
        if (dateTo) {
          params.dateTo = new Date(dateTo).setHours(23, 59, 59, 999)
        }

        const response = await getUserActivitiesAPI(currentUser._id, params)

        if (isLoadMore) {
          setActivities((prev) => [...prev, ...response.activities])
          setOffset((prev) => prev + ITEMS_PER_PAGE)
        } else {
          setActivities(response.activities)
          setOffset(0)
        }
        setTotal(response.total)
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [currentUser?._id, selectedActivityTypes, dateFrom, dateTo, offset]
  )

  // Initial fetch and refetch when filters change
  useEffect(() => {
    fetchActivities(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id, selectedActivityTypes, dateFrom, dateTo])

  // Calculate hasMore
  const hasMore = activities.length < total

  // Group activities by date
  const groupedActivities = groupActivitiesByDate(activities)

  // Handle filter dialog open
  const handleFilterClick = () => {
    setTempSelectedTypes(selectedActivityTypes)
    setTempDateFrom(dateFrom)
    setTempDateTo(dateTo)
    setFilterDialogOpen(true)
  }

  // Handle filter dialog close
  const handleFilterClose = () => {
    setFilterDialogOpen(false)
  }

  // Handle activity type checkbox change
  const handleActivityTypeChange = (typeValue) => {
    setTempSelectedTypes((prev) =>
      prev.includes(typeValue) ? prev.filter((t) => t !== typeValue) : [...prev, typeValue]
    )
  }

  // Handle deselect all activity types
  const handleDeselectAll = () => {
    setTempSelectedTypes([])
  }

  // Handle select all activity types
  const handleSelectAll = () => {
    setTempSelectedTypes(allActivityTypes)
  }

  // Handle apply filters
  const handleApplyFilters = () => {
    setSelectedActivityTypes(tempSelectedTypes.length > 0 ? tempSelectedTypes : allActivityTypes)
    setDateFrom(tempDateFrom)
    setDateTo(tempDateTo)
    setOffset(0) // Reset pagination on filter change
    setFilterDialogOpen(false)
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setTempSelectedTypes(allActivityTypes)
    setTempDateFrom('')
    setTempDateTo('')
  }

  // Handle load more
  const handleLoadMore = () => {
    fetchActivities(true)
  }

  // Check if any filters are active
  const hasActiveFilters = selectedActivityTypes.length !== allActivityTypes.length || dateFrom !== '' || dateTo !== ''

  return (
    <Layout>
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
              Hoạt động
            </Typography>
            <Typography
              sx={{
                fontSize: '16px',
                color: 'text.secondary',
              }}
            >
              Theo dõi tất cả hoạt động và thay đổi
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
            Lọc hoạt động
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
              Lọc hoạt động
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

            {/* Activity Types Section */}
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
                  Loại hoạt động
                </Typography>
                <Button
                  onClick={tempSelectedTypes.length === allActivityTypes.length ? handleDeselectAll : handleSelectAll}
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
                  {tempSelectedTypes.length === allActivityTypes.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </Button>
              </Box>

              {/* Activity Type Checkboxes Grid */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 0.5,
                }}
              >
                {activityTypeCheckboxOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={tempSelectedTypes.includes(option.value)}
                        onChange={() => handleActivityTypeChange(option.value)}
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

        {/* Activity List */}
        <Box sx={{ maxWidth: 960, mx: 'auto' }}>
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
          ) : groupedActivities.length > 0 ? (
            <>
              {groupedActivities.map((group, index) => (
                <DateGroup
                  key={group.date}
                  date={group.date}
                  activities={group.activities}
                  isLast={index === groupedActivities.length - 1 && !hasMore}
                  currentUserId={currentUser?._id}
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
                    Tải thêm ({total - activities.length} hoạt động còn lại)
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
                Không có hoạt động nào
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  )
}

export default Activity
