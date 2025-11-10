import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { formatCurrency } from '~/utils/formatters'

const PaymentDialog = ({ open, onClose, creditor, onSubmit }) => {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Set amount when dialog opens or creditor changes
  useEffect(() => {
    if (open && creditor?.totalAmount) {
      setAmount(creditor.totalAmount.toString())
    }
  }, [open, creditor])

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
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(87, 77, 152, 0.2)'
        }
      }}
    >
      <DialogTitle
        sx={{
          color: '#574D98',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 2.5,
          px: 3,
          position: 'relative'
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Xác nhận số tiền thanh toán
        </Typography>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: '#574D98',
            position: 'absolute',
            right: 16,
            '&:hover': { backgroundColor: 'rgba(87, 77, 152, 0.1)' }
          }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2, px: 3 }}>
        {/* Creditor Info */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{ color: '#574D98', fontWeight: 600, mb: 1 }}
          >
            Người nhận
          </Typography>
          <TextField
            fullWidth
            value={creditor?.userName || ''}
            InputProps={{
              readOnly: true,
              sx: {
                borderRadius: 2,
                backgroundColor: '#e0e0e0', // Gray background to indicate read-only
                '& input': {
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#574D98'
                }
              }
            }}
          />
        </Box>

        {/* Amount Input */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{ color: '#574D98', fontWeight: 600, mb: 1 }}
          >
            Số tiền <span style={{ color: '#d32f2f' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            value={formatAmountDisplay(amount)}
            onChange={handleAmountChange}
            placeholder={formatAmountDisplay(creditor?.totalAmount?.toString() || '0')}
            error={!!errors.amount}
            helperText={errors.amount}
            disabled={loading}
            InputProps={{
              endAdornment: <InputAdornment position="end">₫</InputAdornment>,
              sx: {
                borderRadius: 2,
                backgroundColor: '#f8f9fa',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#574D98',
                  borderWidth: 2
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#6b5fa8'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#574D98'
                },
                '& input': {
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#574D98'
                }
              }
            }}
          />
        </Box>

        {/* Note Input */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: '#574D98', fontWeight: 600, mb: 1 }}
          >
            Ghi chú
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Thêm ghi chú (không bắt buộc)"
            disabled={loading}
            InputProps={{
              sx: {
                borderRadius: 2,
                backgroundColor: '#f8f9fa',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#574D98'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#574D98'
                }
              }
            }}
          />
        </Box>

        {/* Error Message */}
        {errors.submit && (
          <Typography
            variant="body2"
            sx={{
              color: '#d32f2f',
              textAlign: 'center',
              mt: 2,
              p: 1.5,
              bgcolor: '#ffebee',
              borderRadius: 1
            }}
          >
            {errors.submit}
          </Typography>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
          display: 'flex',
          gap: 1.5
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            color: '#574D98',
            borderColor: '#574D98',
            '&:hover': {
              borderColor: '#6b5fa8',
              backgroundColor: 'rgba(87, 77, 152, 0.05)'
            }
          }}
          variant="outlined"
        >
          Quay lại
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            flex: 1,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #574D98 0%, #6b5fa8 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #6b5fa8 0%, #7a6eb8 100%)'
            }
          }}
          variant="contained"
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PaymentDialog
