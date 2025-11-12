import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material'
import { Close as CloseIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material'
import { formatCurrency } from '~/utils/formatters'

const PaymentDialog = ({ open, onClose, creditor, onSubmit }) => {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [qrLoading, setQrLoading] = useState(false)

  // Set amount when dialog opens or creditor changes
  useEffect(() => {
    if (open && creditor?.totalAmount) {
      setAmount(creditor.totalAmount.toString())
    }
  }, [open, creditor])

  // Generate QR code URL when amount or creditor changes
  useEffect(() => {
    if (creditor?.bankName && creditor?.bankAccount && amount) {
      const amountValue = parseFloat(amount) || 0
      if (amountValue > 0) {
        setQrLoading(true)
        const qrUrl = `https://img.vietqr.io/image/${creditor.bankName}-${creditor.bankAccount}-qr_only.png?amount=${amountValue}`
        setQrCodeUrl(qrUrl)
      } else {
        setQrCodeUrl('')
        setQrLoading(false)
      }
    } else {
      setQrCodeUrl('')
      setQrLoading(false)
    }
  }, [amount, creditor?.bankName, creditor?.bankAccount])

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

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await onSubmit({
        creditorId: creditor.userId,
        amount: parseFloat(amount),
        note: note.trim()
      })
      
      // Reset form
      setAmount('')
      setNote('')
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Payment submission error:', error)
      setErrors({ submit: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setAmount('')
      setNote('')
      setErrors({})
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none'
        }
      }}
    >
      <DialogContent sx={{ p: 3, position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          disabled={loading}
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

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600, 
              fontSize: '18px',
              fontFamily: "'Nunito Sans', sans-serif",
              mb: 0.5
            }}
          >
            Thông tin chuyển khoản
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
            Chuyển khoản cho {creditor?.userName || ''}
          </Typography>
        </Box>

        {/* Amount Input */}
        <Box sx={{ mb: 2 }}>
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
                  py: 1
                }
              }
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: '12px' }}>
            Tổng nợ: {formatCurrency(creditor?.totalAmount || 0)}
          </Typography>
        </Box>

        {/* Bank Information Section - Conditionally Rendered */}
        {creditor?.bankName && creditor?.bankAccount && (
          <Box 
            sx={{ 
              bgcolor: '#f5f5f5',
              borderRadius: '18px',
              p: 2,
              mb: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '16px' }}>
                Ngân hàng:
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ fontSize: '16px' }}>
                {creditor.bankName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '16px' }}>
                Số tài khoản:
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ fontSize: '16px' }}>
                {creditor.bankAccount}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: qrCodeUrl ? 2 : 0 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '16px' }}>
                Tên:
              </Typography>
              <Typography variant="body2" fontWeight="600" sx={{ fontSize: '16px' }}>
                {creditor.userName}
              </Typography>
            </Box>

            {/* QR Code */}
            {qrCodeUrl && (
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 2,
                  pt: 2,
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

        {/* Error Message */}
        {errors.submit && (
          <Typography
            variant="body2"
            sx={{
              color: '#d32f2f',
              textAlign: 'center',
              mb: 2,
              p: 1.5,
              bgcolor: '#ffebee',
              borderRadius: 2
            }}
          >
            {errors.submit}
          </Typography>
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

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            fullWidth
            sx={{
              py: 1,
              borderRadius: '18px',
              textTransform: 'none',
              fontSize: '14px',
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
            Để sau
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
            startIcon={<CheckCircleIcon />}
            sx={{
              py: 1,
              borderRadius: '18px',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              background: 'linear-gradient(135deg, #ef9a9a 0%, #ce93d8 100%)',
              color: 'white',
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
            {loading ? 'Đang xử lý...' : 'Đã thanh toán'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentDialog
