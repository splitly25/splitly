import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material'
import { Close as CloseIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { formatCurrency } from '~/utils/formatters'
import { submitReminderPaymentAPI } from '~/apis'

const PaymentReminderPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [qrLoading, setQrLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [reminderData, setReminderData] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [isUsed, setIsUsed] = useState(false)
  const [usedMessage, setUsedMessage] = useState('')

  // Fetch reminder data on mount
  useEffect(() => {
    const fetchReminderData = async () => {
      if (!token) {
        setFetchError('Token không hợp lệ')
        setFetching(false)
        return
      }

      try {
        // Import the API function
        const { getReminderByTokenAPI } = await import('~/apis')
        const data = await getReminderByTokenAPI(token)
        
        if (data.isUsed) {
          setIsUsed(true)
          setUsedMessage(data.usedMessage)
        } else {
          setReminderData(data)
          setAmount(data.totalAmount.toString())
        }
      } catch (err) {
        setFetchError('Không thể tải thông tin nhắc nhở. Vui lòng thử lại.')
      } finally {
        setFetching(false)
      }
    }

    fetchReminderData()
  }, [token])

  // Generate QR code URL when amount or creditor changes
  useEffect(() => {
    if (reminderData?.creditor?.bankName && reminderData?.creditor?.bankAccount && amount) {
      const amountValue = parseFloat(amount) || 0
      if (amountValue > 0) {
        setQrLoading(true)
        const qrUrl = `https://img.vietqr.io/image/${reminderData.creditor.bankName}-${reminderData.creditor.bankAccount}-qr_only.png?amount=${amountValue}`
        setQrCodeUrl(qrUrl)
      } else {
        setQrCodeUrl('')
        setQrLoading(false)
      }
    } else {
      setQrCodeUrl('')
      setQrLoading(false)
    }
  }, [amount, reminderData])

  const handleAmountChange = (e) => {
    // Remove all non-digit characters
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmount(value)
    if (errors.amount) {
      setErrors({ ...errors, amount: '' })
    }
  }

  // Format amount with thousand separators for display
  const formatAmountDisplay = (value) => {
    if (!value) return ''
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!amount || amount === '0') {
      newErrors.amount = 'Vui lòng nhập số tiền'
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePaymentClick = () => {
    if (!validateForm()) return
    setShowConfirmation(true)
  }

  const handleConfirmPayment = async () => {
    setLoading(true)
    try {
      await submitReminderPaymentAPI({
        token,
        amount: parseFloat(amount),
        note: note.trim()
      })

      // Show success and redirect
      navigate('/payment/remind/success')
    } catch (error) {
      console.error('Payment submission error:', error)
      setErrors({ submit: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.' })
      setShowConfirmation(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
  }

  if (fetching) {
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
        <CircularProgress size={50} />
      </Box>
    )
  }

  if (fetchError) {
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
          <Alert severity="error">{fetchError}</Alert>
        </Container>
      </Box>
    )
  }

  if (isUsed) {
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
              <CheckCircleIcon
                sx={{
                  fontSize: 80,
                  color: 'success.main',
                  mb: 3
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  fontFamily: "'Nunito Sans', sans-serif"
                }}
              >
                Đã xác nhận thanh toán
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }} dangerouslySetInnerHTML={{ __html: usedMessage }} />
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{
                  borderRadius: '18px',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: 'white',
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #ef9a9a 0%, #ce93d8 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e57373 0%, #ba68c8 100%)'
                  }
                }}
              >
                Đăng nhập
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    )
  }

  const creditor = reminderData?.creditor

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        py: 4,
        px: 2
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
          <CardContent sx={{ p: 4, position: 'relative' }}>
            {/* Close Button */}
            <IconButton
              onClick={() => navigate('/')}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: 'text.secondary',
                opacity: 0.7,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  opacity: 1
                }
              }}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            {/* Conditional Content: Payment Info or Confirmation */}
            {!showConfirmation ? (
              <>
                {/* Header */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ef9a9a 0%, #ce93d8 100%)',
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
                    Thanh toán nợ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chuyển khoản cho <strong>{creditor?.name}</strong>
                  </Typography>
                </Box>

                {/* Amount Input */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, mb: 1, fontSize: '14px' }}
                  >
                    Số tiền thanh toán
                  </Typography>
                  <TextField
                    fullWidth
                    value={formatAmountDisplay(amount)}
                    onChange={handleAmountChange}
                    placeholder="0"
                    error={!!errors.amount}
                    disabled={loading}
                    InputProps={{
                      endAdornment: <InputAdornment position="end" sx={{ color: 'text.secondary' }}>₫</InputAdornment>,
                      sx: {
                        borderRadius: '18px',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'divider'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'divider'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main'
                        },
                        '& input': {
                          fontSize: '14px',
                          py: 1.5
                        }
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '12px' }}>
                    Tổng nợ: {formatCurrency(reminderData?.totalAmount || 0)}
                  </Typography>
                </Box>

                {/* Bank Information Section */}
                {creditor?.bankName && creditor?.bankAccount && (
                  <Box
                    sx={{
                      bgcolor: '#f5f5f5',
                      borderRadius: '18px',
                      p: 3,
                      mb: 3
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, fontSize: '16px' }}>
                      Thông tin chuyển khoản
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                        Ngân hàng:
                      </Typography>
                      <Typography variant="body2" fontWeight="600" sx={{ fontSize: '14px' }}>
                        {creditor.bankName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                        Số tài khoản:
                      </Typography>
                      <Typography variant="body2" fontWeight="600" sx={{ fontSize: '14px' }}>
                        {creditor.bankAccount}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: qrCodeUrl ? 2 : 0 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                        Tên:
                      </Typography>
                      <Typography variant="body2" fontWeight="600" sx={{ fontSize: '14px' }}>
                        {creditor.name}
                      </Typography>
                    </Box>

                    {/* QR Code */}
                    {qrCodeUrl && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          mt: 3,
                          pt: 3,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          minHeight: '220px'
                        }}
                      >
                        {qrLoading && (
                          <CircularProgress
                            size={40}
                            sx={{
                              color: 'primary.main',
                              position: 'absolute'
                            }}
                          />
                        )}
                        <Box
                          component="img"
                          src={qrCodeUrl}
                          alt="QR Code thanh toán"
                          sx={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            bgcolor: 'white',
                            p: 1,
                            display: qrLoading ? 'none' : 'block'
                          }}
                          onLoad={() => setQrLoading(false)}
                          onError={(e) => {
                            console.error('Failed to load QR code')
                            setQrLoading(false)
                            e.target.style.display = 'none'
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                )}

                {/* Error Messages */}
                {errors.submit && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {errors.submit}
                  </Alert>
                )}
                {errors.amount && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#d32f2f',
                      display: 'block',
                      mb: 2
                    }}
                  >
                    {errors.amount}
                  </Typography>
                )}

                {/* Action Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handlePaymentClick}
                  disabled={loading}
                  startIcon={<CheckCircleIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: '18px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'white',
                    background: 'linear-gradient(135deg, #ef9a9a 0%, #ce93d8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #e57373 0%, #ba68c8 100%)'
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                      color: 'rgba(0, 0, 0, 0.26)'
                    }
                  }}
                >
                  {loading ? 'Đang xử lý...' : 'Tôi đã thanh toán'}
                </Button>
              </>
            ) : (
              <>
                {/* Confirmation View */}
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        fontFamily: "'Nunito Sans', sans-serif"
                      }}
                    >
                      Xác nhận thanh toán
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '16px', color: 'text.primary', mb: 2 }}>
                      Bạn đã thanh toán <strong>{formatCurrency(parseFloat(amount) || 0)}₫</strong> cho <strong>{creditor?.name}</strong>?
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      onClick={handleCancelConfirmation}
                      disabled={loading}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: '18px',
                        textTransform: 'none',
                        fontSize: '15px',
                        fontWeight: 500,
                        color: 'text.primary',
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'divider',
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                      variant="outlined"
                    >
                      Quay lại
                    </Button>
                    <Button
                      onClick={handleConfirmPayment}
                      disabled={loading}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: '18px',
                        textTransform: 'none',
                        fontSize: '15px',
                        fontWeight: 500,
                        background: 'linear-gradient(135deg, #ef9a9a 0%, #ce93d8 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #e57373 0%, #ba68c8 100%)'
                        },
                        '&:disabled': {
                          background: 'rgba(0, 0, 0, 0.12)',
                          color: 'rgba(0, 0, 0, 0.26)'
                        }
                      }}
                      variant="contained"
                    >
                      {loading ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default PaymentReminderPage