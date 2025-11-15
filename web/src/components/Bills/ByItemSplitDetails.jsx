import { Box, Typography, Avatar, Button, IconButton, Chip } from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CustomTextField from '~/components/Form/CustomTextField'
import { COLORS } from '~/theme'
import ParticipantCard from '../Form/ParticipantCard'

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
  onValidateAmounts,
}) {
  const handleValidateTotal = async () => {
    // Validate the total amount against sum of items
    if (onValidateAmounts) {
      await onValidateAmounts()
    }
  }

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
        <Button
          onClick={onAddItem}
          sx={{
            background: COLORS.gradientPrimary,
            color: '#FAFAFA',
            borderRadius: '16px',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            padding: '6px 12px',
            height: '32px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        >
          <AddIcon sx={{ width: '18px', height: '18px' }} />
          Thêm món
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
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
                  placeholder="VD: 2+3 hoặc 5*2"
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
                  placeholder="VD: 10000+5000"
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

      {/* Total Amount Input - Moved below items */}
      <Box sx={{ mb: 3 }}>
        <CustomTextField
          label="Tổng số tiền thanh toán"
          required
          type="text"
          placeholder="VD: 100+200 hoặc 500*3 hoặc (100+50)/2"
          enableAutoCalculate
          value={formData.totalAmount || ''}
          onChange={(e) => onFieldChange('totalAmount', e.target.value)}
          InputProps={{
            startAdornment: <AttachMoneyIcon sx={{ width: '20px', height: '20px', mr: 1, color: 'text.secondary' }} />,
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <Typography
            sx={{
              fontSize: '14px',
              color: 'text.secondary',
            }}
          >
            Hỗ trợ phép tính: + (cộng), - (trừ), * (nhân), / (chia), () (ngoặc)
          </Typography>
          <Button
            onClick={handleValidateTotal}
            sx={(theme) => ({
              minWidth: '140px',
              borderRadius: '16px',
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 500,
              border: `0.8px solid ${theme.palette.divider}`,
              color: 'primary.main',
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
              '&:hover': {
                border: `0.8px solid ${theme.palette.primary.main}`,
                backgroundColor:
                  theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.16)' : 'rgba(25, 118, 210, 0.08)',
              },
            })}
          >
            Kiểm tra tổng tiền
          </Button>
        </Box>
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

export default ByItemSplitDetails
