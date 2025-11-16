import React, { useState } from 'react'
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
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

const handleConfirmPaymentSubmit = async ({userId, refetch, formData}) => {
  try {
    await authorizedAxiosInstance.post(`${API_ROOT}/v1/debts/${userId}/confirm-payment`, formData)
    // setConfirmDialogOpen(false)
    // setSelectedDebtor(null)
    await refetch()
  } catch (err) {
    console.error('Error confirming payment:', err)
    alert('Xác nhận thanh toán thất bại!')
  }
}

const ConfirmPaymentDialog = ({ open, onClose, myId, debtor, defaultAmount, bills, refetch }) => {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  React.useEffect(() => {
    if (open) {
      setAmount((defaultAmount || 0).toString())
      setNote('')
      setErrors({})
      setShowConfirmation(false)
    }
  }, [open, defaultAmount])

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    setAmount(value)
    if (errors.amount) {
      setErrors({ ...errors, amount: '' })
    }
  }

  // Format amount with thousand separators for display
  const formatAmountDisplay = (value) => {
    const str = String(value || '')
    if (!str) return ''
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handleConfirmClick = () => {
    const amt = parseInt(amount, 10)
    if (!amt || amt <= 0) {
      setErrors({ amount: 'Số tiền không hợp lệ' })
      return
    }
    setErrors({})
    setShowConfirmation(true)
  }

  const handleConfirmPayment = async () => {
    try {
      setConfirmLoading(true)
      await handleConfirmPaymentSubmit(
      {
        userId: myId,
        refetch,
        formData: {
          debtorId: debtor.userId,
          amount: parseInt(amount, 10),
          bills: bills.map(b => ({ billId: b.billId, amount: b.remainingAmount })),
          note,
          isConfirmed: true
        }
      })
    } catch (error) {
      console.error('Payment confirmation error:', error)
      setErrors({ submit: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.' })
      setShowConfirmation(false)
    } finally {
      setConfirmLoading(false)
      // Reset form
      setAmount('')
      setNote('')
      setErrors({})
      setShowConfirmation(false)
      onClose()
    }
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
  }

  const handleClose = () => {
    if (!confirmLoading) {
      setAmount('')
      setNote('')
      setErrors({})
      setShowConfirmation(false)
      onClose()
    }
  }

  // If debtor is null, render nothing (or a fallback UI)
  if (!debtor) return null

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
          disabled={confirmLoading}
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

        {/* Conditional Content: Confirmation Info or Confirmation */}
        {!showConfirmation ? (
          <>

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
            Thông tin xác nhận
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
            Từ {debtor.userName}
          </Typography>
        </Box>

        {/* Amount Input */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, mb: 1, fontSize: '14px' }}
          >
            Số tiền đã nhận
          </Typography>
          <TextField
            fullWidth
            value={formatAmountDisplay(amount)}
            onChange={handleAmountChange}
            placeholder="0"
            error={!!errors.amount}
            disabled={confirmLoading}
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
        </Box>

        {/* Note Input */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, mb: 1, fontSize: '14px' }}
          >
            Ghi chú (tuỳ chọn)
          </Typography>
          <TextField
            fullWidth
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Nhập ghi chú..."
            disabled={confirmLoading}
            multiline
            minRows={2}
            InputProps={{
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
                '& textarea': {
                  fontSize: '14px'
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
            disabled={confirmLoading}
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
            Huỷ
          </Button>
          <Button
            onClick={handleConfirmClick}
            disabled={confirmLoading}
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
            {confirmLoading ? <CircularProgress size={20} /> : 'Xác nhận'}
          </Button>
        </Box>
        </>
        ) : (
          <>
            {/* Confirmation View */}
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '18px',
                    fontFamily: "'Nunito Sans', sans-serif",
                    mb: 2
                  }}
                >
                  Xác nhận đã nhận tiền
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '15px', color: 'text.primary' }}>
                  Bạn đã nhận được <strong>{formatCurrency(parseFloat(amount) || 0)}</strong> từ <strong>{debtor?.userName}</strong> chưa?
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button
                  onClick={handleCancelConfirmation}
                  disabled={confirmLoading}
                  fullWidth
                  sx={{
                    py: 1.2,
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
                  Chưa nhận
                </Button>
                <Button
                  onClick={handleConfirmPayment}
                  disabled={confirmLoading}
                  fullWidth
                  sx={{
                    py: 1.2,
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
                  {confirmLoading ? 'Đang xử lý...' : 'Đã nhận'}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmPaymentDialog
