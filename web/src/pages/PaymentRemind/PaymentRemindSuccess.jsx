import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button
} from '@mui/material'
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'

const PaymentRemindSuccess = () => {
  const navigate = useNavigate()

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
            <CheckCircleIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
              Thanh toán thành công!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Cảm ơn bạn đã thanh toán. Thông tin đã được cập nhật và người nhận sẽ được thông báo.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                background: 'linear-gradient(135deg, #ef9a9a 0%, #ce93d8 100%)',
                borderRadius: '16px',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontWeight: 500,
                '&:hover': {
                  background: 'linear-gradient(135deg, #e57373 0%, #ba68c8 100%)'
                }
              }}
            >
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default PaymentRemindSuccess