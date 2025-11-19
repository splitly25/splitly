import { Box, Typography } from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CustomTextField from '~/components/Form/CustomTextField'
import ParticipantCard from '../Form/ParticipantCard'

function EqualSplitDetails({ formData, onFieldChange, participants, totalAmount }) {
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
        <CustomTextField
          label="Tổng số tiền thanh toán"
          required
          type="text"
          placeholder="VD:100 or 100+200*10..."
          enableAutoCalculate
          value={formData.totalAmount || ''}
          onChange={(e) => onFieldChange('totalAmount', e.target.value)}
          InputProps={{
            startAdornment: <AttachMoneyIcon sx={{ width: '20px', height: '20px', mr: 1, color: 'text.secondary' }} />,
          }}
        />
        <Typography
          sx={{
            fontSize: '14px',
            color: 'text.secondary',
            mt: 1,
          }}
        >
          Hỗ trợ: + (cộng), - (trừ), * (nhân), / (chia), () (ngoặc)
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
          <ParticipantCard
            key={participant.id}
            participant={participant}
            showAmountInput={false}
            onAmountChange={() => {}}
            onDelete={() => {}}
            canDelete={false}
          />
        ))}
      </Box>

      {/* Total */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' , p: 2}}>
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
