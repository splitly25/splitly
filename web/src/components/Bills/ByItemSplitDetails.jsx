import { Box, Typography, IconButton, Chip } from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CustomTextField from '~/components/Form/CustomTextField'
import { COLORS } from '~/theme'
import ParticipantCard from '../Form/ParticipantCard'
import Button from '@mui/material/Button'
import { formatCurrency } from '~/utils/formatters'

function ByItemSplitDetails({
  formData,
  onFieldChange,
  participants,
  totalAmount,
  items,
  onAddItem,
  onDeleteItem,
  onItemChange,
  onItemAllocationToggle,
}) {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        border: `0.8px solid ${theme.palette.divider}`,
        borderRadius: '16px',
        boxShadow: 'none',
        mb: 10,
        padding: '24px',
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 3 }}>
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

      {/* Items Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          Danh sách món hàng
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        {items.map((item, index) => (
          <Box
            key={item.id}
            sx={(theme) => ({
              backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#F5F5F5',
              borderRadius: '16px',
              padding: '16px',
            })}
          >
            {/* Item Name Row */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <CustomTextField
                  label={`Tên món ${index + 1}`}
                  value={item.name}
                  onChange={(e) => onItemChange(item.id, 'name', e.target.value)}
                  placeholder="VD: Rau tươi"
                  size="small"
                />
              </Box>
              <IconButton
                onClick={() => onDeleteItem(item.id)}
                disabled={items.length === 1}
                sx={(theme) => ({
                  mt: -1,
                  color: theme.palette.error.main,
                  '&:disabled': {
                    color: theme.palette.action.disabled,
                  },
                })}
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>

            {/* Quantity, Price, Total Row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' },
                gap: 2,
                mb: 2,
              }}
            >
              <Box>
                <CustomTextField
                  label="Số lượng"
                  type="text"
                  enableAutoCalculate
                  value={item.quantity || ''}
                  onChange={(e) => onItemChange(item.id, 'quantity', e.target.value)}
                  placeholder="VD: 2+3"
                  size="small"
                />
              </Box>
              <Box>
                <CustomTextField
                  label="Đơn giá"
                  type="text"
                  enableAutoCalculate
                  value={item.amount || ''}
                  onChange={(e) => onItemChange(item.id, 'amount', e.target.value)}
                  placeholder="VD: 65k"
                  size="small"
                />
              </Box>
              <Box
                sx={{
                  gridColumn: { xs: 'span 2', sm: 'auto' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  pt: { xs: 0, sm: 2 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'text.secondary',
                    mb: 0.5,
                  }}
                >
                  Thành tiền
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: '18px', sm: '16px' },
                    fontWeight: 600,
                    color: 'primary.main',
                  }}
                >
                  {((item.quantity || 1) * (item.amount || 0)).toLocaleString('vi-VN')} ₫
                </Typography>
              </Box>
            </Box>

            {/* Participant allocation checkboxes */}
            <Box>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'text.secondary',
                  mb: 1,
                }}
              >
                Phân bổ cho:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {participants.map((participant) => (
                  <Chip
                    key={participant.id}
                    label={participant.name}
                    onClick={() => onItemAllocationToggle(item.id, participant.id)}
                    color={item.allocatedTo.includes(participant.id) ? 'primary' : 'default'}
                    variant={item.allocatedTo.includes(participant.id) ? 'filled' : 'outlined'}
                    sx={{
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Add Item Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Button
          onClick={onAddItem}
          sx={{
            background: COLORS.gradientPrimary,
            color: '#FAFAFA',
            borderRadius: '16px',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            padding: '8px 16px',
            height: '36px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          <AddIcon sx={{ width: '18px', height: '18px' }} />
          Thêm món
        </Button>
      </Box>

      {/* Total Amount Input - Moved below items */}
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

export default ByItemSplitDetails
