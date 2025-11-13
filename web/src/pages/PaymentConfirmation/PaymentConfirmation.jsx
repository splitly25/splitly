import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Error as ErrorIcon
} from '@mui/icons-material'
import { COLORS } from '~/theme'
import { verifyPaymentTokenAPI, confirmPaymentAPI } from '~/apis'

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [paymentData, setPaymentData] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [confirmationType, setConfirmationType] = useState(null) // 'confirmed' or 'rejected'

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Token không hợp lệ')
        setLoading(false)
        return
      }

      try {
        const response = await verifyPaymentTokenAPI(token)
        
        // Check if token has already been used
        if (response.alreadyUsed) {
          setConfirmed(true)
          setConfirmationType(response.isConfirmed ? 'confirmed' : 'rejected')
          setLoading(false)
          return
        }
        
        setPaymentData(response)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể xác thực token. Vui lòng thử lại.')
        setLoading(false)
      }
    }

    verifyToken()
  }, [token])

  const handleConfirm = async (isConfirmed) => {
    setSubmitting(true)
    try {
      await confirmPaymentAPI(token, isConfirmed)
      setConfirmed(true)
      setConfirmationType(isConfirmed ? 'confirmed' : 'rejected')
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress size={50} sx={{ color: COLORS.primary }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3
        }}
      >
        <Container maxWidth="sm">
          <Card
            sx={{
              borderRadius: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <ErrorIcon sx={{ fontSize: 64, color: '#ef4444', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                Đã có lỗi xảy ra
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {error}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{
                  background: COLORS.gradientPrimary,
                  borderRadius: '16px',
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  fontWeight: 500
                }}
              >
                Về trang đăng nhập
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    )
  }

  if (confirmed) {
    const isAlreadyUsed = !submitting && paymentData === null // Token was already used before
    
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3
        }}
      >
        <Container maxWidth="sm">
          <Card
            sx={{
              borderRadius: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              {isAlreadyUsed ? (
                <>
                  <ErrorIcon sx={{ fontSize: 64, color: '#f59e0b', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                    Yêu cầu đã được xác nhận
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Bạn đã phản hồi cho yêu cầu xác nhận này trước đó.<br />
                    Vui lòng đăng nhập để xem chi tiết.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                    sx={{
                      background: COLORS.gradientPrimary,
                      borderRadius: '16px',
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      fontWeight: 500,
                      '&:hover': {
                        background: COLORS.gradientPrimary,
                        opacity: 0.9
                      }
                    }}
                  >
                    Đăng nhập
                  </Button>
                </>
              ) : confirmationType === 'confirmed' ? (
                <>
                  <CheckCircleIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                    Xác nhận thành công!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Cảm ơn bạn đã xác nhận đã nhận được tiền. Giao dịch đã được cập nhật và người thanh toán đã nhận được email thông báo.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderRadius: '16px',
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      fontWeight: 500,
                      borderColor: 'divider',
                      color: 'text.primary'
                    }}
                  >
                    Về trang đăng nhập
                  </Button>
                </>
              ) : (
                <>
                  <CancelIcon sx={{ fontSize: 64, color: '#f59e0b', mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                    Đã ghi nhận
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Cảm ơn bạn đã phản hồi. Người thanh toán đã nhận được thông báo và sẽ liên hệ lại với bạn.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderRadius: '16px',
                      textTransform: 'none',
                      px: 4,
                      py: 1.5,
                      fontWeight: 500,
                      borderColor: 'divider',
                      color: 'text.primary'
                    }}
                  >
                    Về trang đăng nhập
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: COLORS.gradientPrimary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '40px'
                }}
              >
                💰
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  fontFamily: "'Nunito Sans', sans-serif"
                }}
              >
                Xác nhận thanh toán
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Xin chào <strong>{paymentData?.recipientName}</strong>
              </Typography>
            </Box>

            {/* Payment Info */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(239, 154, 154, 0.1) 0%, rgba(206, 147, 216, 0.1) 100%)',
                borderRadius: '20px',
                p: 3,
                mb: 3
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  textAlign: 'center',
                  fontSize: '16px',
                  color: 'text.primary'
                }}
              >
                <strong>{paymentData?.payerName}</strong> đã thanh toán
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  textAlign: 'center',
                  background: COLORS.gradientPrimary,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: paymentData?.note ? 2 : 0
                }}
              >
                {paymentData?.amount.toLocaleString('vi-VN')}₫
              </Typography>
              {paymentData?.note && (
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'rgba(206, 147, 216, 0.3)'
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    📝 Ghi chú:
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {paymentData.note}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Question */}
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                mb: 3,
                color: 'text.primary',
                fontSize: '16px'
              }}
            >
              Bạn đã nhận được tiền này chưa?
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleConfirm(false)}
                disabled={submitting}
                startIcon={<CancelIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: '16px',
                  textTransform: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'divider',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Chưa nhận được
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleConfirm(true)}
                disabled={submitting}
                startIcon={<CheckCircleIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: '16px',
                  textTransform: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  background: COLORS.gradientPrimary,
                  '&:hover': {
                    background: COLORS.gradientPrimary,
                    opacity: 0.9
                  }
                }}
              >
                {submitting ? 'Đang xử lý...' : 'Đã nhận được'}
              </Button>
            </Box>

            {/* Footer Note */}
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                mt: 3,
                color: 'text.secondary',
                fontSize: '13px'
              }}
            >
              Link này sẽ hết hạn sau 3 ngày kể từ khi được tạo
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default PaymentConfirmation
