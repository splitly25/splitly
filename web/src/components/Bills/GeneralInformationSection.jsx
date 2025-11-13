import { Box, Typography, Button } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Controller } from 'react-hook-form'
import CustomTextField from '~/components/Form/CustomTextField'
import CustomSelect from '~/components/Form/CustomSelect'
import CustomDatePicker from '~/components/Form/CustomDatePicker'
import SplitTypeToggle from '~/components/Form/SplitTypeToggle'
import { categoryOptions } from '~/apis/mock-data'

function GeneralInformationSection({ control, getPayerName, onOpenPayerDialog }) {
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
        <Controller
          name="billName"
          control={control}
          rules={{ required: 'Vui lòng nhập tên hóa đơn' }}
          render={({ field, fieldState: { error } }) => (
            <CustomTextField
              {...field}
              label="Tên hóa đơn"
              required
              placeholder="VD: Ăn tối nhà hàng"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="category"
          control={control}
          rules={{ required: 'Vui lòng chọn phân loại' }}
          render={({ field }) => <CustomSelect {...field} label="Phân loại" required options={categoryOptions} />}
        />
      </Box>

      {/* Row 2: Notes */}
      <Box sx={{ mb: 3 }}>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <CustomTextField {...field} label="Ghi chú" placeholder="Thêm mô tả cho hóa đơn..." multiline rows={3} />
          )}
        />
      </Box>

      {/* Row 3: Dates and Payer */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', mb: 3 }}>
        <Controller
          name="creationDate"
          control={control}
          render={({ field }) => (
            <CustomDatePicker label="Thời gian tạo" value={field.value} onChange={(date) => field.onChange(date)} />
          )}
        />
        <Controller
          name="paymentDeadline"
          control={control}
          render={({ field }) => (
            <CustomDatePicker label="Hạn thanh toán" value={field.value} onChange={(date) => field.onChange(date)} />
          )}
        />
        <Controller
          name="payer"
          control={control}
          rules={{ required: 'Vui lòng chọn người ứng tiền' }}
          render={({ field, fieldState: { error } }) => (
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
                  border: `0.8px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
                  color: field.value ? theme.palette.text.primary : theme.palette.text.secondary,
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  padding: '8px 12px',
                  fontWeight: 400,
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.default,
                    border: `0.8px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
                  },
                })}
              >
                {getPayerName()}
              </Button>
              {error && (
                <Typography sx={{ fontSize: '12px', color: 'error.main', mt: 0.5, ml: 1.5 }}>
                  {error.message}
                </Typography>
              )}
            </Box>
          )}
        />
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
        <Controller
          name="splitType"
          control={control}
          render={({ field }) => <SplitTypeToggle value={field.value} onChange={field.onChange} />}
        />
      </Box>
    </Box>
  )
}

export default GeneralInformationSection
