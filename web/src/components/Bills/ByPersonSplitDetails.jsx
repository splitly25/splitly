import { Box, Typography } from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CustomTextField from '~/components/Form/CustomTextField'
import ParticipantCard from '../Form/ParticipantCard'
import { formatCurrency } from '~/utils/formatters'

function ByPersonSplitDetails({ formData, onFieldChange, participants, totalAmount }) {
  return (
    <Box
      sx={(theme) => ({
        mb: 10,
        backgroundColor: theme.palette.background.default,
        border: `0.8px solid ${theme.palette.divider}`,
        borderRadius: '16px',
        boxShadow: 'none',
        padding: '24px',
      })}
    >
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: '8px' }}>
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

      {/* Total Amount Input */}
      <Box sx={{ mb: 3 }}>
        <CustomTextField
          label="Tổng số tiền thanh toán"
          required
          type="text"
          placeholder="VD: 100+200 hoặc 65k"
          enableAutoCalculate
          value={formData.totalAmount || ''}
          onChange={(e) => onFieldChange('totalAmount', e.target.value)}
          InputProps={{
            startAdornment: <AttachMoneyIcon sx={{ width: '20px', height: '20px', mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      <Box sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, pt: 3, mb: 3 }} />
        
      {/* Auto Calculate Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

      {/* Participant Cards */}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
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
          {formatCurrency(totalAmount || 0)} ₫
        </Typography>
      </Box>
    </Box>
  )
}

export default ByPersonSplitDetails
