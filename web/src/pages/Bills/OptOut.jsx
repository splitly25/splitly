import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { optOutBillAPI, verifyOptOutTokenAPI } from '../../apis'
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import CloseIcon from '@mui/icons-material/Close'

const OptOut = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('initial') // initial, loading, success, error
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setError('Đường dẫn từ chối không hợp lệ. Thiếu mã token.')
    } else {
      // Verify token first
      const verifyToken = async () => {
        try {
          await verifyOptOutTokenAPI(token)
          setTokenValid(true)
        } catch (error) {
          const message = error.response?.data?.message
          if (message === 'User is not a participant in this bill') {
            setStatus('already_opted_out')
          } else if (message === 'User has already opted out from this bill') {
            setStatus('already_opted_out')
          } else if (message === 'Bill not found') {
            setStatus('bill_not_found')
          } else {
            setStatus('error')
            setError(message || 'Mã token không hợp lệ hoặc đã hết hạn.')
          }
        }
      }
      verifyToken()
    }
  }, [token])

  const handleConfirmOptOut = () => {
    setShowConfirmation(true)
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
  }

  const handleFinalOptOut = async () => {
    setStatus('loading')
    try {
      const response = await optOutBillAPI(token)
      setStatus('success')
      setMessage('Đã từ chối tham gia hóa đơn thành công.')
    } catch (error) {
      const message = error.response?.data?.message
      if (message === 'User has already opted out from this bill') {
        setStatus('already_opted_out')
        setMessage('Bạn đã từ chối tham gia hóa đơn này rồi.')
      } else {
        setStatus('error')
        setError(error.response?.data?.message || 'Không thể từ chối. Đường dẫn có thể không hợp lệ hoặc đã hết hạn.')
      }
    }
  }

  if (status === 'loading') {
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

            {/* Conditional Content */}
            {status === 'error' ? (
              <>
                <ErrorIcon
                  sx={{
                    fontSize: 80,
                    color: 'error.main',
                    mb: 3,
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: "'Nunito Sans', sans-serif",
                    textAlign: 'center'
                  }}
                >
                  Từ chối thất bại
                </Typography>
                <Alert severity="error" sx={{ mb: 4 }}>
                  {error}
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
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
                    },
                    display: 'block',
                    margin: '0 auto'
                  }}
                >
                  Về trang chủ
                </Button>
              </>
            ) : status === 'already_opted_out' ? (
              <>
                <CheckCircleIcon
                  sx={{
                    fontSize: 80,
                    color: 'success.main',
                    mb: 3,
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: "'Nunito Sans', sans-serif",
                    textAlign: 'center'
                  }}
                >
                  Đã từ chối
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
                  Bạn đã từ chối tham gia hóa đơn này rồi.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
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
                    },
                    display: 'block',
                    margin: '0 auto'
                  }}
                >
                  Về trang chủ
                </Button>
              </>
            ) : status === 'bill_not_found' ? (
              <>
                <ErrorIcon
                  sx={{
                    fontSize: 80,
                    color: 'error.main',
                    mb: 3,
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: "'Nunito Sans', sans-serif",
                    textAlign: 'center'
                  }}
                >
                  Hóa đơn không tồn tại
                </Typography>
                <Alert severity="error" sx={{ mb: 4 }}>
                  Hóa đơn này không tồn tại hoặc đã bị xóa.
                </Alert>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
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
                    },
                    display: 'block',
                    margin: '0 auto'
                  }}
                >
                  Về trang chủ
                </Button>
              </>
            ) : !tokenValid ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={50} />
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                  Đang xác minh mã token...
                </Typography>
              </Box>
            ) : !showConfirmation ? (
              <>
                {/* Initial Confirmation Screen */}
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
                      Xác nhận từ chối
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '16px', color: 'text.primary', mb: 2 }}>
                      Bạn có chắc chắn muốn từ chối tham gia hóa đơn này?
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      onClick={() => navigate('/')}
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
                      Hủy
                    </Button>
                    <Button
                      onClick={handleConfirmOptOut}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: '18px',
                        textTransform: 'none',
                        fontSize: '15px',
                        fontWeight: 500,
                        color: 'white',
                        background: 'linear-gradient(135deg, #ef9a9a 0%, #ce93d8 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #e57373 0%, #ba68c8 100%)'
                        }
                      }}
                      variant="contained"
                    >
                      Xác nhận từ chối
                    </Button>
                  </Box>
                </Box>
              </>
            ) : status === 'initial' ? (
              <>
                {/* Final Confirmation Screen */}
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
                      Xác nhận lần cuối
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: '16px', color: 'text.primary', mb: 2 }}>
                      Bạn thực sự muốn từ chối tham gia hóa đơn này?
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      onClick={handleCancelConfirmation}
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
                      onClick={handleFinalOptOut}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: '18px',
                        textTransform: 'none',
                        fontSize: '15px',
                        fontWeight: 500,
                        color: 'white',
                        background: 'linear-gradient(135deg, #ef9a9a 0%, #ce93d8 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #e57373 0%, #ba68c8 100%)'
                        }
                      }}
                      variant="contained"
                    >
                      Xác nhận
                    </Button>
                  </Box>
                </Box>
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircleIcon
                  sx={{
                    fontSize: 80,
                    color: 'success.main',
                    mb: 3,
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    fontFamily: "'Nunito Sans', sans-serif",
                    textAlign: 'center'
                  }}
                >
                  Từ chối thành công
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
                  {message}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
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
                    },
                    display: 'block',
                    margin: '0 auto'
                  }}
                >
                  Về trang chủ
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default OptOut