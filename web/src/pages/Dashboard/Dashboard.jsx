import Layout from '~/components/Layout'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { fetchDashboardDataAPI } from '~/apis'
import { formatCurrency } from '~/utils/formatters'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  ArrowForward as ArrowForwardIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'
import { COLORS } from '~/theme'

// Total Spending Card Component
const TotalSpendingCard = ({ debtData, loading }) => {
  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          height: '100%',
          width: '100%',
          backgroundColor: '#ffffff',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" width={150} height={20} sx={{ mb: 5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Skeleton variant="text" width={120} height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={200} height={20} />
            </Box>
            <Skeleton variant="circular" width={48} height={48} />
          </Box>
        </CardContent>
      </Card>
    )
  }

  // Use current month spending from backend
  const currentMonthSpending = debtData.currentMonthSpending || 0
  const percentageChange = debtData.percentageChange || 0
  
  // Determine if spending increased or decreased
  const isIncrease = percentageChange >= 0
  const TrendIcon = isIncrease ? TrendingUpIcon : TrendingDownIcon
  const trendColor = isIncrease ? '#ff4444' : '#00a63e'
  const changeText = isIncrease ? 'Tăng' : 'Giảm'
  
  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        width: '100%',
        backgroundColor: '#ffffff',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontWeight: 500,
            fontSize: '14px',
            color: 'text.secondary',
            mb: 5,
          }}
        >
          Tổng chi tiêu tháng này
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: '24px',
                color: 'text.primary',
                mb: 1,
              }}
            >
              {formatCurrency(currentMonthSpending)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendIcon sx={{ fontSize: 14, color: trendColor }} />
              <Typography variant="caption" sx={{ fontSize: '14px', color: trendColor }}>
                {changeText} {Math.abs(percentageChange).toFixed(1)}% so với tháng trước
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: COLORS.gradientPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MoneyIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

// You Owe Card Component
const YouOweCard = ({ debtData, loading }) => {
  const [showAmount, setShowAmount] = useState(true)

  const toggleVisibility = () => {
    setShowAmount(!showAmount)
  }

  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: '16px',
          border: '1px solid #ffd6a7',
          backgroundColor: '#fff9f0',
          height: '100%',
          width: '100%',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="text" width={150} height={20} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
          <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #ffd6a7', display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Skeleton variant="text" width={80} height={16} />
              <Skeleton variant="text" width={100} height={40} />
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Skeleton variant="text" width={60} height={16} />
              <Skeleton variant="text" width={50} height={40} />
            </Box>
          </Box>
          <Skeleton variant="rectangular" width="100%" height={70} sx={{ borderRadius: '16px' }} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid #ffd6a7',
        backgroundColor: '#fff9f0',
        height: '100%',
        width: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ArrowForwardIcon sx={{ fontSize: 20, color: '#ca3500' }} />
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontWeight: 500,
                fontSize: '14px',
                color: 'text.primary',
              }}
            >
              Mình nợ người khác
            </Typography>
          </Box>
          <IconButton size="small" onClick={toggleVisibility}>
            {showAmount ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
          </IconButton>
        </Box>
        <Box
          sx={{
            borderBottom: '1px solid #ffd6a7',
            pb: 2,
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary' }}>
              Tổng số tiền
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, fontSize: '24px', color: '#ca3500' }}
            >
              {showAmount ? formatCurrency(Math.abs(debtData.youOwe)) : '*******'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary' }}>
              Số người
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, fontSize: '24px', color: '#ca3500' }}
            >
              {debtData.debtDetails?.length || 0}
            </Typography>
          </Box>
        </Box>
        {debtData.debtDetails && debtData.debtDetails.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {debtData.debtDetails.map((debt, index) => (
              <Card
                key={index}
                sx={{
                  borderRadius: '16px',
                  border: '1px solid #ffedd4',
                  p: 1.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: COLORS.gradientPrimary,
                      fontSize: '14px',
                    }}
                  >
                    {debt.name.substring(0, 2).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '14px' }}>
                      {debt.name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      {debt.billCount} {debt.billCount === 1 ? 'hóa đơn' : 'hóa đơn'}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, fontSize: '14px', color: '#ca3500' }}
                >
                  {showAmount ? formatCurrency(Math.abs(debt.amount)) : '*******'}
                </Typography>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Không có nợ nào
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

// They Owe You Card Component
const TheyOweYouCard = ({ debtData, loading }) => {
  const [showAmount, setShowAmount] = useState(true)

  const toggleVisibility = () => {
    setShowAmount(!showAmount)
  }

  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: '16px',
          border: '1px solid #b9f8cf',
          backgroundColor: '#f0fdf4',
          height: '100%',
          width: '100%',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="text" width={150} height={20} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
          <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #b9f8cf', display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Skeleton variant="text" width={80} height={16} />
              <Skeleton variant="text" width={100} height={40} />
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Skeleton variant="text" width={60} height={16} />
              <Skeleton variant="text" width={50} height={40} />
            </Box>
          </Box>
          <Skeleton variant="rectangular" width="100%" height={70} sx={{ borderRadius: '16px' }} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid #b9f8cf',
        backgroundColor: '#f0fdf4',
        height: '100%',
        width: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ArrowForwardIcon sx={{ fontSize: 20, color: '#008236' }} />
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontWeight: 500,
                fontSize: '14px',
                color: 'text.primary',
              }}
            >
              Người khác nợ mình
            </Typography>
          </Box>
          <IconButton size="small" onClick={toggleVisibility}>
            {showAmount ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
          </IconButton>
        </Box>
        <Box
          sx={{
            borderBottom: '1px solid #b9f8cf',
            pb: 2,
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary' }}>
              Tổng số tiền
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, fontSize: '24px', color: '#008236' }}
            >
              {showAmount ? formatCurrency(Math.abs(debtData.theyOweYou)) : '*******'}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary' }}>
              Số người
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, fontSize: '24px', color: '#008236' }}
            >
              {debtData.creditDetails?.length || 0}
            </Typography>
          </Box>
        </Box>
        {debtData.creditDetails && debtData.creditDetails.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {debtData.creditDetails.map((credit, index) => (
              <Card
                key={index}
                sx={{
                  borderRadius: '16px',
                  border: '1px solid #d4f5e0',
                  p: 1.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: COLORS.gradientPrimary,
                      fontSize: '14px',
                    }}
                  >
                    {credit.name.substring(0, 2).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '14px' }}>
                      {credit.name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary' }}>
                      {credit.billCount} {credit.billCount === 1 ? 'hóa đơn' : 'hóa đơn'}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, fontSize: '14px', color: '#008236' }}
                >
                  {showAmount ? formatCurrency(Math.abs(credit.amount)) : '*******'}
                </Typography>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Không có ai nợ bạn
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

// Pending Bills Card Component
const PendingBillsCard = ({ pendingBills, navigate, loading }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (loading) {
    return (
      <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', backgroundColor: '#ffffff', width: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={80} height={24} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton variant="circular" width={48} height={48} />
                  <Box>
                    <Skeleton variant="text" width={150} height={24} />
                    <Skeleton variant="text" width={100} height={20} />
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Skeleton variant="text" width={80} height={24} />
                  <Skeleton variant="rectangular" width={100} height={22} sx={{ borderRadius: '11px', mt: 0.5 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', backgroundColor: '#ffffff', width: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 600,
              fontSize: '20px',
            }}
          >
            Hóa đơn chưa quyết toán
          </Typography>
          <Button
            size="small"
            startIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/history')}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Xem tất cả
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {pendingBills.bills && pendingBills.bills.length > 0 ? (
            pendingBills.bills.slice(0, 2).map((bill, index) => (
              <Box
                key={bill.id || index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: '16px',
                  '&:hover': { backgroundColor: 'action.hover' },
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/history')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      background: COLORS.gradientPrimary,
                      fontSize: '16px',
                    }}
                  >
                    {bill.name.substring(0, 1).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '16px' }}>
                      {bill.name}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '14px', color: 'text.secondary' }}>
                      {formatDate(bill.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '16px', mb: 0.5 }}>
                    {formatCurrency(bill.amount)}
                  </Typography>
                  <Chip
                    label="Chưa thanh toán"
                    size="small"
                    sx={{
                      backgroundColor: '#ffedd4',
                      color: '#9f2d00',
                      fontSize: '12px',
                      height: '22px',
                    }}
                  />
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
              Không có hóa đơn chưa quyết toán
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

// Recent Activities Card Component
const RecentActivitiesCard = ({ activities, navigate, loading }) => {
  if (loading) {
    return (
      <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', backgroundColor: '#ffffff', width: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={80} height={24} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[1, 2, 3].map((i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                }}
              >
                <Skeleton variant="circular" width={32} height={32} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="60%" height={18} />
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', backgroundColor: '#ffffff', width: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 600,
              fontSize: '20px',
            }}
          >
            Hoạt động gần đây
          </Typography>
          <Button
            size="small"
            startIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/activity')}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Xem tất cả
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activities && activities.length > 0 ? (
            activities.slice(0, 3).map((activity) => (
              <Box
                key={activity.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    background: COLORS.gradientPrimary,
                    fontSize: '12px',
                  }}
                >
                  NA
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '14px', mb: 0.5 }}>
                    {activity.message}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    18:30 - 10/11
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', p: 2, color: 'text.secondary' }}>
              Không có hoạt động gần đây
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

// Groups Card Component
const GroupsCard = ({ groups, navigate, loading }) => {
  if (loading) {
    return (
      <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', backgroundColor: '#ffffff', width: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Skeleton variant="text" width={200} height={32} />
            <Skeleton variant="text" width={80} height={24} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Box
                key={i}
                sx={{
                  p: 1.5,
                  borderRadius: '16px',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ display: 'flex', ml: -0.5 }}>
                    {[1, 2, 3].map((j) => (
                      <Skeleton
                        key={j}
                        variant="circular"
                        width={24}
                        height={24}
                        sx={{
                          border: '2px solid white',
                          ml: j > 1 ? -1 : 0,
                        }}
                      />
                    ))}
                  </Box>
                  <Skeleton variant="text" width={120} height={20} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Skeleton variant="text" width={100} height={18} />
                  <Skeleton variant="text" width={80} height={22} />
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', backgroundColor: '#ffffff', width: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 600,
              fontSize: '20px',
            }}
          >
            Nhóm chi tiêu
          </Typography>
          <Button
            size="small"
            startIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/groups')}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Xem tất cả
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {groups && groups.length > 0 ? (
            groups.slice(0, 5).map((group) => (
              <Box
                key={group._id}
                sx={{
                  p: 1.5,
                  borderRadius: '16px',
                  '&:hover': { backgroundColor: 'action.hover' },
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/groups')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ display: 'flex', ml: -0.5 }}>
                    {group.memberDetails && group.memberDetails.slice(0, 3).map((member, idx) => (
                      <Avatar
                        key={member._id || idx}
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: '12px',
                          background: COLORS.gradientPrimary,
                          border: '2px solid white',
                          ml: idx > 0 ? -1 : 0,
                        }}
                      >
                        {member.name.substring(0, 2).toUpperCase()}
                      </Avatar>
                    ))}
                    {group.memberDetails && group.memberDetails.length > 3 && (
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          fontSize: '10px',
                          background: COLORS.gradientPrimary,
                          border: '2px solid white',
                          ml: -1,
                        }}
                      >
                        +{group.memberDetails.length - 3}
                      </Avatar>
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '14px' }}>
                    {group.groupName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    {group.bills?.length || 0} hóa đơn
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    {group.memberDetails?.length || 0} thành viên
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', p: 2, color: 'text.secondary' }}>
              Không có nhóm nào
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

// Skeleton Loading Components
const SkeletonCard = ({ height = 200, children }) => (
  <Card
    sx={{
      borderRadius: '16px',
      border: '1px solid',
      borderColor: 'divider',
      height: height,
      width: '100%',
      backgroundColor: '#ffffff',
    }}
  >
    <CardContent sx={{ p: 3 }}>
      {children}
    </CardContent>
  </Card>
)

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const containerRef = useRef(null)

  // Get current user from Redux store
  const currentUser = useSelector(selectCurrentUser)
  const currentUserId = currentUser?._id

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const element = containerRef.current
        const computedStyle = window.getComputedStyle(element)
        const paddingLeft = parseFloat(computedStyle.paddingLeft)
        const paddingRight = parseFloat(computedStyle.paddingRight)
        // Get the width minus padding
        const actualWidth = element.offsetWidth - paddingLeft - paddingRight
        setContainerWidth(actualWidth)
      }
    }

    // Initial measurement
    updateWidth()
    
    // Add resize listener
    window.addEventListener('resize', updateWidth)
    
    // Measure again after a short delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(updateWidth, 100)
    
    return () => {
      window.removeEventListener('resize', updateWidth)
      clearTimeout(timeoutId)
    }
  }, [dashboardData])

  // Determine layout based on actual container width (after subtracting padding)
  const shouldUseThreeColumns = containerWidth >= 1000  // Enough space for 3 columns
  const shouldUseTwoColumns = containerWidth >= 600 && containerWidth < 1000  // 2 columns mode

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUserId) {
        setLoading(false)
        setError('User not authenticated')
        return
      }

      try {
        setLoading(true)
        const data = await fetchDashboardDataAPI(currentUserId)
        setDashboardData(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [currentUserId])

  if (error) {
    return (
      <Layout>
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            minHeight: '100vh',
            backgroundColor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" color="error">
            {error}
          </Typography>
        </Box>
      </Layout>
    )
  }

  if (!dashboardData && !loading) {
    return (
      <Layout>
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            minHeight: '100vh',
            backgroundColor: 'background.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" color="text.secondary">
            No data available
          </Typography>
        </Box>
      </Layout>
    )
  }

  const { user, debtData, pendingBills, groups, activities } = dashboardData || {}

  return (
    <Layout>
      <Box
        ref={containerRef}
        sx={{
          p: { xs: 3, md: 4 },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
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
            Trang chủ
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '16px' }}>
            Xin chào! Đây là tổng quan chi tiêu của bạn.
          </Typography>
        </Box>

        {/* Top Cards Grid */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {/* Tổng chi tiêu Card */}
          <Grid 
            item 
            xs={12}
            sx={{ 
              display: 'flex', 
              flexGrow: 1, 
              minWidth: 0,
              flexBasis: shouldUseThreeColumns ? 'calc(33.333% - 10.67px)' : (shouldUseTwoColumns ? '100%' : '100%'),
              maxWidth: shouldUseThreeColumns ? 'calc(33.333% - 10.67px)' : (shouldUseTwoColumns ? '100%' : '100%')
            }}
          >
            <TotalSpendingCard debtData={debtData} loading={loading} />
          </Grid>

          {/* Mình nợ người khác Card */}
          <Grid 
            item 
            xs={12}
            sx={{ 
              display: 'flex', 
              flexGrow: 1, 
              minWidth: 0,
              flexBasis: shouldUseThreeColumns ? 'calc(33.333% - 10.67px)' : (shouldUseTwoColumns ? 'calc(50% - 8px)' : '100%'),
              maxWidth: shouldUseThreeColumns ? 'calc(33.333% - 10.67px)' : (shouldUseTwoColumns ? 'calc(50% - 8px)' : '100%')
            }}
          >
            <YouOweCard debtData={debtData} loading={loading} />
          </Grid>

          {/* Người khác nợ mình Card */}
          <Grid 
            item 
            xs={12}
            sx={{ 
              display: 'flex', 
              flexGrow: 1, 
              minWidth: 0,
              flexBasis: shouldUseThreeColumns ? 'calc(33.333% - 10.67px)' : (shouldUseTwoColumns ? 'calc(50% - 8px)' : '100%'),
              maxWidth: shouldUseThreeColumns ? 'calc(33.333% - 10.67px)' : (shouldUseTwoColumns ? 'calc(50% - 8px)' : '100%')
            }}
          >
            <TheyOweYouCard debtData={debtData} loading={loading} />
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Grid container spacing={2}>
          {/* Left Column - Hóa đơn chưa quyết toán and Hoạt động gần đây */}
          <Grid item xs={12} lg={8} sx={{ display: 'flex', flexGrow: 2, minWidth: 0 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
              <PendingBillsCard pendingBills={pendingBills} navigate={navigate} loading={loading} />
              <RecentActivitiesCard activities={activities} navigate={navigate} loading={loading} />
            </Box>
          </Grid>

          {/* Right Column - Nhóm chi tiêu */}
          <Grid item xs={12} lg={4} sx={{ display: 'flex', flexGrow: 1, minWidth: 0 }}>
            <GroupsCard groups={groups} navigate={navigate} loading={loading} />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  )
}

export default Dashboard
