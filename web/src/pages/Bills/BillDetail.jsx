import Layout from '~/components/Layout'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useSelector } from 'react-redux'
import { fetchBillByIdAPI } from '~/apis'
import colors from 'tailwindcss/colors'
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  IconButton,
  Divider,
  CircularProgress,
  Checkbox,
  Button,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import { getInitials } from '~/utils/formatters'
import { useColorScheme } from '@mui/material/styles'

const BillDetail = () => {
  const { billId } = useParams()
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const [billData, setBillData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { mode, setMode } = useColorScheme()
  const hoverGradient = 'linear-gradient(135deg, #EF9A9A 0%, #CE93D8 100%)'


  useEffect(() => {
    const fetchBillDetail = async () => {
      try {
        setLoading(true)
        const response = await fetchBillByIdAPI(billId)
        setBillData(response)
        setError(null)
      } catch (err) {
        console.error('Error fetching bill detail:', err)
        setError('Không thể tải thông tin hóa đơn')
      } finally {
        setLoading(false)
      }
    }

    if (billId) {
      fetchBillDetail()
    }
  }, [billId])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = new Date(timestamp)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const calculateProgress = () => {
    if (!billData) return 0
    const paidParticipants = billData.participants.filter((p) => p.paid).length
    return (paidParticipants / billData.participants.length) * 100
  }

  const getTotalPaid = () => {
    if (!billData) return 0
    return billData.participants.filter((p) => p.paid).reduce((sum, p) => sum + p.amount, 0)
  }

  const getTotalUnpaid = () => {
    if (!billData) return 0
    return billData.participants.filter((p) => !p.paid).reduce((sum, p) => sum + p.amount, 0)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  const handleSettleBill = () => {
    // TODO: Implement settle bill logic
    console.log('Nhắc nhở thanh toán')
  }

  const handleConfirmPayment = async (participant) => {
    try {
      // TODO: Implement API call to confirm payment
      console.log('Confirming payment for:', participant)
      
      // For now, show a confirmation message
      if (window.confirm(`Xác nhận ${participant.name} đã thanh toán ${formatCurrency(participant.amount)} đ?`)) {
        // Call API to mark as paid
        // await markAsPaidAPI(billId, participant._id, participant.amount)
        
        // Refresh bill data
        const response = await fetchBillByIdAPI(billId)
        setBillData(response)
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  const handlePayment = async (participant) => {
    try {
      // TODO: Implement payment flow
      console.log('Initiating payment for:', participant)
      
      // Show payment dialog or redirect to payment page
      if (window.confirm(`Thanh toán ${formatCurrency(participant.amount)} đ cho hóa đơn "${billData.billName}"?`)) {
        // Call payment API
        // await makePaymentAPI(billId, participant.amount)
        
        // Refresh bill data
        const response = await fetchBillByIdAPI(billId)
        setBillData(response)
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    }
  }

  // Helper function to determine if current user is the bill owner
  const isBillOwner = () => {
    return currentUser?._id === billData?.payer?._id
  }

  // Helper function to get current user's participant data
  const getCurrentUserParticipant = () => {
    return billData?.participants?.find(p => p._id === currentUser?._id)
  }

  if (loading) {
    return (
      <Layout>
        <Box className="flex items-center justify-center min-h-screen">
          <CircularProgress sx={{ color: '#EF9A9A' }} />
        </Box>
      </Layout>
    )
  }

  if (error || !billData) {
    return (
      <Layout>
        <Box className="flex flex-col items-center justify-center min-h-screen">
          <Typography variant="h6" color="error" className="mb-4">
            {error || 'Không tìm thấy hóa đơn'}
          </Typography>
          <Button variant="contained" onClick={handleBack} sx={{ bgcolor: '#EF9A9A' }}>
            Quay lại
          </Button>
        </Box>
      </Layout>
    )
  }

  const paidCount = billData.participants.filter((p) => p.paid).length
  const totalPaid = getTotalPaid()
  const totalUnpaid = getTotalUnpaid()
  const progress = calculateProgress()

  return (
    <Layout>
      <Box className="@container main-container">
        {/* Header */}
        <Box
          sx={{
            mb: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <Box className="flex items-center gap-3">
            <IconButton
              onClick={handleBack}
              sx={{
                color: '#0A0A0A',
                '&:hover': {
                  backgroundColor: colors.purple[50],
                },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#0A0A0A',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                {billData.billName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                Chi tiết hóa đơn
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
              justifyContent: { xs: 'space-between', sm: 'flex-end' },
            }}
          >
            <Button
              variant="contained"
              onClick={handleSettleBill}
              sx={{
                bgcolor: '#EF9A9A',
                color: '#1A1A1A',
                borderRadius: '12px',
                textTransform: 'none',
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                whiteSpace: 'nowrap',
                flex: { xs: 1, sm: 'none' },
                '&:hover': {
                  bgcolor: '#E57373',
                },
              }}
            >
              Nhắc nhở thanh toán
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: { xs: 3, sm: 2, md: 4 },
            mb: { xs: 4, md: 6 },
          }}
        >
          {/* Total Amount */}
          <Card
            sx={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #EF9A9A 0%, #CE93D8 100%)',
              color: '#1A1A1A',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 }, color: 'white'}}>
              <Box className="flex items-center gap-2 mb-2">
                <AttachMoneyIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: 'white' }}>
                  Tổng tiền
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }, color: 'white' }}>
                {formatCurrency(billData.totalAmount)} đ
              </Typography>
            </CardContent>
          </Card>

          {/* Paid Amount */}
          <Card
            sx={{
              borderRadius: '16px',
              background: (theme) => (theme.palette.mode === 'dark' ? '#2D2D2D' : '#FFFFFF'),
              border: (theme) => (theme.palette.mode === 'dark' ? 'none' : '1px solid #E5E7EB'),
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box className="flex items-center gap-2 mb-2">
                <CheckCircleIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: '#4CAF50' }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  color="text.secondary"
                >
                  Đã thanh toán
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: '#4CAF50', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
              >
                {formatCurrency(totalPaid)} đ
              </Typography>
            </CardContent>
          </Card>

          {/* Unpaid Amount */}
          <Card
            sx={{
              borderRadius: '16px',
              background: (theme) => (theme.palette.mode === 'dark' ? '#2D2D2D' : '#FFFFFF'),
              border: (theme) => (theme.palette.mode === 'dark' ? 'none' : '1px solid #E5E7EB'),
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box className="flex items-center gap-2 mb-2">
                <AccessTimeIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: '#FF9800' }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  color="text.secondary"
                >
                  Quay lại
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: '#FF9800', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}
              >
                {formatCurrency(totalUnpaid)} đ
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Main Content */}
        <Box className="grid grid-cols-1 @3xl:grid-cols-[2fr_1fr] gap-4 @md:gap-6">
          {/* Left Column - Bill Information */}
          <Box>
            <Card
              sx={{
                borderRadius: '16px',
                background: (theme) => (theme.palette.mode === 'dark' ? '#2D2D2D' : '#FFFFFF'),
                border: (theme) => (theme.palette.mode === 'dark' ? 'none' : '1px solid #E5E7EB'),
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Thông tin hóa đơn
                </Typography>

                {/* Payer */}
                <Box className="mb-4">
                  <Box className="flex items-center gap-2 mb-2">
                    <PersonIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                    >
                      Người thanh toán
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 }, }}>
                    <Avatar
                      sx={{
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        background: 'linear-gradient(135deg, #EF9A9A 0%, #CE93D8 100%)',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        fontWeight: 700,
                      }}
                    >
                      {getInitials(billData.payer.name)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        {billData.payer.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                      >
                        {billData.payer.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Date Created and Payment Deadline - Same Row */}
                <Box 
                  sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: { xs: 3, sm: 4 },
                    mb: 4
                  }}
                >
                  {/* Date Created */}
                  <Box>
                    <Box className="flex items-center gap-2 mb-2">
                      <CalendarIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Ngày tạo
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      {formatDateTime(billData.createdAt)}
                    </Typography>
                  </Box>

                  {/* Payment Deadline */}
                  <Box>
                    <Box className="flex items-center gap-2 mb-2">
                      <AccessTimeIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Hạn thanh toán
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      {formatDate(billData.paymentDate)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Status and Category - Same Row */}
                <Box 
                  sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: { xs: 3, sm: 4 },
                    mb: 4
                  }}
                >
                  {/* Status */}
                  <Box>
                    <Box className="flex items-center gap-2 mb-2">
                      <ReceiptIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Trạng thái
                      </Typography>
                    </Box>
                    <Chip
                      label={billData.settled ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      sx={{
                        bgcolor: billData.settled ? '#D1FAE5' : '#FEF3C7',
                        color: billData.settled ? '#10B981' : '#F59E0B',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        height: { xs: 28, sm: 32 },
                      }}
                    />
                  </Box>

                  {/* Category */}
                  <Box>
                    <Box className="flex items-center gap-2 mb-2">
                      <DescriptionIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Danh mục
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      {billData.category}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Payment Progress */}
                <Box className="mb-4">
                  <Box className="flex items-center gap-2 mb-2">
                    <CheckCircleIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                    >
                      Tiến độ thanh toán
                    </Typography>
                  </Box>
                  <Box className="flex justify-between items-center mb-2">
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                      {paidCount}/{billData.participants.length} người đã thanh toán
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                        color: hoverGradient
                      }}
                    >
                      {Math.round(progress)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: { xs: 8, sm: 10 },
                      borderRadius: 5,
                      bgcolor: hoverGradient
                    }}
                  />
                </Box>

                {/* Description */}
                {billData.description && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Box>
                      <Box className="flex items-center gap-2 mb-2">
                        <DescriptionIcon sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          Ghi chú
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          
                          color: 'text.secondary',
                          fontSize: { xs: '0.85rem', sm: '1rem' },
                          lineHeight: 1.6,
                        }}
                      >
                        {billData.description}
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Right Column - Participants */}
          <Box>
            <Card
              sx={{
                borderRadius: '16px',
                background: (theme) => (theme.palette.mode === 'dark' ? '#2D2D2D' : '#FFFFFF'),
                border: (theme) => (theme.palette.mode === 'dark' ? 'none' : '1px solid #E5E7EB'),
              }}
            >
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Người tham gia
                </Typography>

                {/* Progress */}
                <Box className="mb-4">
                  <Box className="flex justify-between items-center mb-2">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                    >
                      Tiến độ thanh toán
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      {paidCount}/{billData.participants.length} người
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: { xs: 6, sm: 8 },
                      borderRadius: 4,
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#3D3D3D' : '#E5E7EB'),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#4CAF50',
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Participants List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                  {billData.participants.map((participant) => (
                    <Box
                      key={participant._id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: '12px',
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1A1A1A' : '#F9FAFB'),
                        gap: { xs: 2, sm: 2 },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 1.5, sm: 2 },
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: { xs: 36, sm: 40 },
                            height: { xs: 36, sm: 40 },
                            background: participant.paid
                              ? 'linear-gradient(135deg, #A7F3D0 0%, #6EE7B7 100%)'
                              : 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
                            color: '#1A1A1A',
                            fontSize: { xs: '0.85rem', sm: '1rem' },
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(participant.name)}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: '0.85rem', sm: '0.9rem' },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {participant.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: { xs: '0.85rem', sm: '0.9rem' },
                              color: participant.paid ? '#4CAF50' : '#FF9800',
                            }}
                          >
                            {formatCurrency(participant.amount)} đ
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Payment Status or Action Button */}
                      {participant.paid ? (
                        // Show green badge if participant has paid
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                          label="Đã thanh toán"
                          size="small"
                          sx={{
                            bgcolor: '#D1FAE5',
                            color: '#10B981',
                            fontWeight: 600,
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                            height: { xs: 30, sm: 32 },
                            minWidth: { xs: 'auto', sm: '120px' },
                            '& .MuiChip-icon': {
                              color: '#10B981',
                            },
                          }}
                        />
                      ) : (
                        // If not paid, show different buttons based on user role
                        <>
                          {isBillOwner() ? (
                            // Bill owner sees confirmation button for unpaid participants
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<CheckCircleIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                              onClick={() => handleConfirmPayment(participant)}
                              sx={{
                                background: 'linear-gradient(90deg, #00c950 0%, #00a63e 100%)',
                                color: 'white',
                                borderRadius: '16px',
                                textTransform: 'none',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                fontWeight: 600,
                                height: { xs: 30, sm: 32 },
                                whiteSpace: 'nowrap',
                                minWidth: { xs: 'auto', sm: '120px' },
                                '&:hover': {
                                  background: 'linear-gradient(90deg, #00a63e 0%, #008e34 100%)',
                                },
                              }}
                            >
                              Xác nhận
                            </Button>
                          ) : participant._id === currentUser?._id ? (
                            // Current participant sees payment button for their own unpaid item
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<SendIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                              onClick={() => handlePayment(participant)}
                              sx={{
                                background: 'linear-gradient(90deg, #ff6900 0%, #f54900 100%)',
                                color: 'white',
                                borderRadius: '16px',
                                textTransform: 'none',
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                fontWeight: 600,
                                height: { xs: 30, sm: 32 },
                                whiteSpace: 'nowrap',
                                minWidth: { xs: 'auto', sm: '120px' },
                                '&:hover': {
                                  background: 'linear-gradient(90deg, #f54900 0%, #e03d00 100%)',
                                },
                              }}
                            >
                              Thanh toán
                            </Button>
                          ) : (
                            // Other participants see pending badge for unpaid items
                            <Chip
                              label="Chưa thanh toán"
                              size="small"
                              sx={{
                                bgcolor: '#FED7AA',
                                color: '#FF9800',
                                fontWeight: 600,
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                height: { xs: 30, sm: 32 },
                                minWidth: { xs: 'auto', sm: '120px' },
                              }}
                            />
                          )}
                        </>
                      )}
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Summary */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                  <Box className="flex justify-between items-center">
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                      Tổng cộng:
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                      {formatCurrency(billData.totalAmount)} đ
                    </Typography>
                  </Box>
                  <Box className="flex justify-between items-center">
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: '#4CAF50', fontSize: { xs: '0.85rem', sm: '0.875rem' } }}
                    >
                      Đã thanh toán:
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#4CAF50', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                      {formatCurrency(totalPaid)} đ
                    </Typography>
                  </Box>
                  <Box className="flex justify-between items-center">
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: '#FF9800', fontSize: { xs: '0.85rem', sm: '0.875rem' } }}
                    >
                      Còn lại:
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: '#FF9800', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                      {formatCurrency(totalUnpaid)} đ
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default BillDetail
