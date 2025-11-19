import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material'
import { Close as CloseIcon, NotificationsActive as NotificationsActiveIcon } from '@mui/icons-material'
import { remindPaymentAPI } from '~/apis'

const RemindDialog = ({ open, onClose, debtor, creditorId }) => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleRemindSubmit = async () => {
    setLoading(true)
    try {
      await remindPaymentAPI({
        creditorId: creditorId,
        debtorId: debtor.userId
      })
      onClose()
    } catch (error) {
      console.error('Remind submission failed:', error)
      setErrors({ submit: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.' })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
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
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
            <NotificationsActiveIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '18px',
              fontFamily: "'Nunito Sans', sans-serif",
              mb: 0.5
            }}
          >
            Gửi nhắc nhở thanh toán
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
            Bạn có muốn gửi nhắc nhở đến {debtor?.userName}?
          </Typography>
        </Box>

        {/* Debtor Info */}
        <Box
          sx={{
            bgcolor: '#f5f5f5',
            borderRadius: '18px',
            p: 2,
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
              Người nợ:
            </Typography>
            <Typography variant="body2" fontWeight="600" sx={{ fontSize: '14px' }}>
              {debtor?.userName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
              Số tiền:
            </Typography>
            <Typography variant="body2" fontWeight="600" sx={{ fontSize: '14px', color: 'error.main' }}>
              {debtor?.totalAmount?.toLocaleString('vi-VN')}₫
            </Typography>
          </Box>
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
            Hủy
          </Button>
          <Button
            onClick={handleRemindSubmit}
            disabled={loading}
            fullWidth
            startIcon={loading ? <CircularProgress size={16} /> : <NotificationsActiveIcon />}
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
            {loading ? 'Đang gửi...' : 'Gửi nhắc nhở'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default RemindDialog