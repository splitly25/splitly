import { Box, Typography, Avatar } from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { Controller } from 'react-hook-form'
import CustomTextField from '~/components/Form/CustomTextField'
import { COLORS } from '~/theme'
import { getInitials } from '~/utils/formatters'

function EqualSplitDetails({ control, participants, totalAmount }) {
  return (
    <Box sx={{ mb: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ mb: 0, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <ReceiptLongIcon sx={{ width: '20px', height: '20px', color: 'text.primary' }} />
          <Typography
            sx={(theme) => ({
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: '20px',
              color: theme.palette.text.primary,
            })}
          >
            Chi tiết hóa đơn
          </Typography>
        </Box>
      </Box>

      {/* Total Amount Input */}
      <Box
        sx={(theme) => ({
          mb: 3,
          backgroundColor: theme.palette.background.default,
          border: `0.8px solid ${theme.palette.divider}`,
          borderRadius: '16px',
          boxShadow: 'none',
          marginBottom: '24px',
          padding: '24px',
        })}
      >
        <Controller
          name="totalAmount"
          control={control}
          rules={{
            required: 'Vui lòng nhập tổng số tiền',
            validate: (value) => {
              const numValue = parseFloat(value)
              if (isNaN(numValue) || numValue <= 0) {
                return 'Số tiền phải lớn hơn 0'
              }
              return true
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <CustomTextField
              {...field}
              label="Tổng số tiền thanh toán"
              required
              type="text"
              placeholder="VD: 100+200 hoặc 500*3 hoặc (100+50)/2"
              enableAutoCalculate
              error={!!error}
              helperText={error?.message}
              InputProps={{
                startAdornment: (
                  <AttachMoneyIcon sx={{ width: '20px', height: '20px', mr: 1, color: 'text.secondary' }} />
                ),
              }}
            />
          )}
        />
        <Typography
          sx={{
            fontSize: '14px',
            color: 'text.secondary',
            mt: 1,
          }}
        >
          Hỗ trợ phép tính: + (cộng), - (trừ), * (nhân), / (chia), () (ngoặc)
        </Typography>
      </Box>

      <Box sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, pt: 3, mb: 3 }} />

      {/* Auto Calculate Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          Tự động tính toán
        </Typography>
      </Box>

      {/* Calculated Amounts - All Participants */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {participants.map((participant) => (
          <Box
            key={participant.id}
            sx={(theme) => ({
              backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F5F5F5',
              borderRadius: '16px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            })}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: COLORS.gradientPrimary,
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#FFFFFF',
                }}
              >
                {getInitials(participant.name)}
              </Avatar>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'text.primary',
                }}
              >
                {participant.name}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 500,
                color: 'text.primary',
              }}
            >
              {participant.amount?.toFixed(0) || 0} ₫
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, pt: 1.5 }} />

      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          Tổng cộng:
        </Typography>
        <Typography
          sx={{
            fontSize: '18px',
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          {totalAmount || 0} ₫
        </Typography>
      </Box>
    </Box>
  )
}

export default EqualSplitDetails
