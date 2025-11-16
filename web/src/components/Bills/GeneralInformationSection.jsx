import { Box, Typography, Button } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CustomTextField from '~/components/Form/CustomTextField'
import CustomSelect from '~/components/Form/CustomSelect'
import CustomDatePicker from '~/components/Form/CustomDatePicker'
import SplitTypeToggle from '~/components/Form/SplitTypeToggle'
import { categoryOptions } from '~/apis/mock-data'

function GeneralInformationSection({ formData, onFieldChange, getPayerName, onOpenPayerDialog }) {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        border: `0.8px solid ${theme.palette.divider}`,
        borderRadius: '16px',
        boxShadow: 'none',
        marginBottom: '24px',
        padding: '24px',
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <InfoOutlinedIcon sx={{ width: '20px', height: '20px', color: 'text.primary' }} />
        <Typography
          sx={(theme) => ({
            fontFamily: "'Nunito Sans', sans-serif",
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: '20px',
            color: theme.palette.text.primary,
          })}
        >
          Thông tin chung
        </Typography>
      </Box>

      {/* Row 1: Bill Name and Category */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', mb: 3 }}>
        <CustomTextField
          label="Tên hóa đơn"
          required
          placeholder="VD: Ăn tối nhà hàng"
          value={formData.billName}
          onChange={(e) => onFieldChange('billName', e.target.value)}
        />
        <CustomSelect
          label="Phân loại"
          required
          options={categoryOptions}
          value={formData.category}
          onChange={(e) => onFieldChange('category', e.target.value)}
        />
      </Box>

      {/* Row 2: Notes */}
      <Box sx={{ mb: 3 }}>
        <CustomTextField
          label="Ghi chú"
          placeholder="Thêm mô tả cho hóa đơn..."
          multiline
          rows={3}
          value={formData.notes}
          onChange={(e) => onFieldChange('notes', e.target.value)}
        />
      </Box>

      {/* Row 3: Dates and Payer */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', mb: 3 }}>
        <CustomDatePicker
          label="Thời gian tạo"
          value={formData.creationDate}
          onChange={(date) => onFieldChange('creationDate', date)}
        />
        <CustomDatePicker
          label="Hạn thanh toán"
          value={formData.paymentDeadline}
          onChange={(date) => onFieldChange('paymentDeadline', date)}
        />
        <Box>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'text.primary',
              mb: 1,
            }}
          >
            Người ứng tiền *
          </Typography>
          <Button
            fullWidth
            onClick={onOpenPayerDialog}
            sx={(theme) => ({
              fontSize: '14px',
              borderRadius: '16px',
              backgroundColor: theme.palette.background.default,
              border: `0.8px solid ${theme.palette.divider}`,
              color: formData.payer ? theme.palette.text.primary : theme.palette.text.secondary,
              textTransform: 'none',
              justifyContent: 'flex-start',
              padding: '8px 12px',
              fontWeight: 400,
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.default,
                border: `0.8px solid ${theme.palette.divider}`,
              },
            })}
          >
            {getPayerName()}
          </Button>
        </Box>
      </Box>

      {/* Row 4: Split Type */}
      <Box>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'text.primary',
            mb: 1,
          }}
        >
          Kiểu chia *
        </Typography>
        <SplitTypeToggle value={formData.splitType} onChange={(value) => onFieldChange('splitType', value)} />
      </Box>
    </Box>
  )
}

export default GeneralInformationSection
