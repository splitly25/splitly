import { Box, Typography } from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CustomTextField from '~/components/Form/CustomTextField'
import ParticipantAutoCaculateList from '../ParticipantAutoCaculateList/ParticipantAutoCaculateList'

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
          placeholder="VD: 100+200 hoặc 65k"
          enableAutoCalculate
          value={formData.totalAmount || ''}
          onChange={(e) => onFieldChange('totalAmount', e.target.value)}
          InputProps={{
            startAdornment: <AttachMoneyIcon sx={{ width: '20px', height: '20px', mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>

      <ParticipantAutoCaculateList participants={participants} totalAmount={totalAmount} />
    </Box>
  )
}

export default EqualSplitDetails
