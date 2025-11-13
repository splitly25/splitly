import { Box, Typography, Avatar, Button, IconButton, Chip } from '@mui/material'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CalculateIcon from '@mui/icons-material/Calculate'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Controller } from 'react-hook-form'
import CustomTextField from '~/components/Form/CustomTextField'
import { COLORS } from '~/theme'
import { getInitials } from '~/utils/formatters'

function ByItemSplitDetails({
  control,
  participants,
  totalAmount,
  items,
  setValue,
  onAddItem,
  onDeleteItem,
  onItemChange,
  onItemAllocationToggle,
}) {
  const handleAutoCalculateTotal = () => {
    const total = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    setValue('totalAmount', total.toString())
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
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
        <Button
          startIcon={<CalculateIcon />}
          onClick={handleAutoCalculateTotal}
          sx={(theme) => ({
            minWidth: { xs: '48px', sm: '140px' },
            borderRadius: '16px',
            textTransform: 'none',
            fontSize: '13px',
            fontWeight: 500,
            border: `0.8px solid ${theme.palette.divider}`,
            color: 'primary.main',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.08)' : 'rgba(25, 118, 210, 0.04)',
            '&:hover': {
              border: `0.8px solid ${theme.palette.primary.main}`,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.16)' : 'rgba(25, 118, 210, 0.08)',
            },
            '& .MuiButton-startIcon': {
              marginRight: { xs: 0, sm: '8px' },
              marginLeft: 0,
            },
          })}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Tự động tính tổng
          </Box>
        </Button>
      </Box>

      {/* Total Amount Input */}
      <Box sx={{ mb: 3 }}>
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

      {/* Items Section */}
      <>
        <Box sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, pt: 3, mb: 3 }} />

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
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <CustomTextField
                    label={`Tên món ${index + 1}`}
                    value={item.name}
                    onChange={(e) => onItemChange(item.id, 'name', e.target.value)}
                    placeholder="VD: Rau tươi"
                    size="small"
                  />
                </Box>
                <Box sx={{ width: '180px' }}>
                  <CustomTextField
                    label="Số tiền"
                    type="number"
                    value={item.amount || ''}
                    onChange={(e) => onItemChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    size="small"
                  />
                </Box>
                <IconButton
                  onClick={() => onDeleteItem(item.id)}
                  disabled={items.length === 1}
                  sx={(theme) => ({
                    mt: 3,
                    color: theme.palette.error.main,
                    '&:disabled': {
                      color: theme.palette.action.disabled,
                    },
                  })}
                >
                  <DeleteOutlineIcon />
                </IconButton>
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
      </>

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

export default ByItemSplitDetails
