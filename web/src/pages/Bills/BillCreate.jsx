/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { Box, Card, Typography, Button, IconButton, Avatar } from '@mui/material'
import { styled } from '@mui/material/styles'
import { COLORS } from '~/theme'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import RefreshIcon from '@mui/icons-material/Refresh'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CustomTextField from '~/components/Form/CustomTextField'
import CustomSelect from '~/components/Form/CustomSelect'
import CustomDatePicker from '~/components/Form/CustomDatePicker'
import SplitTypeToggle from '~/components/Form/SplitTypeToggle'
import ParticipantCard from '~/components/Form/ParticipantCard'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import AddParticipantDialog from '~/components/Bills/AddParticipantDialog'
import SelectPayerDialog from '~/components/Bills/SelectPayerDialog'
// import { createBillAPI } from '~/apis'
import { categoryOptions, mockGroups, mockPeople } from '~/apis/mock-data'
import { useForm, Controller } from 'react-hook-form'

const SectionCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  border: `0.8px solid ${theme.palette.divider}`,
  borderRadius: '16px',
  boxShadow: 'none',
  marginBottom: '24px',
  padding: '24px',
}))

const SectionHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '24px',
})

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Nunito Sans', sans-serif",
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '20px',
  color: theme.palette.text.primary,
}))

const GradientButton = styled(Button)({
  background: COLORS.gradientPrimary,
  color: '#FAFAFA',
  borderRadius: '16px',
  textTransform: 'none',
  fontSize: '14px',
  fontWeight: 500,
  padding: '6px 12px',
  height: '32px',
  '&:hover': {
    background: COLORS.gradientPrimary,
    opacity: 0.9,
  },
})

function BillCreate() {
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  // React Hook Form setup
  const {
    control,
    handleSubmit: handleFormSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      billName: '',
      category: 'food',
      notes: '',
      creationDate: new Date().toISOString(),
      paymentDeadline: '',
      payer: currentUser?._id || '',
      splitType: 'equal',
      totalAmount: 0,
    },
  })

  // Watch form values
  const watchedValues = watch()
  const { splitType, totalAmount } = watchedValues

  // Participants state
  const [participants, setParticipants] = useState([
    {
      id: currentUser?._id,
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      amount: 0,
      usedAmount: 0,
    },
  ])

  // Dialog states
  const [openParticipantDialog, setOpenParticipantDialog] = useState(false)
  const [openPayerDialog, setOpenPayerDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const payerOptions = participants.map((p) => ({ value: p.id, label: p.name }))

  const handleAddParticipants = (newParticipants) => {
    const participantsToAdd = newParticipants.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      amount: 0,
      usedAmount: 0,
    }))

    // Filter out duplicates
    const existingIds = participants.map((p) => p.id)
    const uniqueParticipants = participantsToAdd.filter((p) => !existingIds.includes(p.id))

    setParticipants([...participants, ...uniqueParticipants])
  }

  const handleSelectPayer = (person) => {
    // Set the payer in the form
    setValue('payer', person.id)

    // Auto-add payer to participants if not already there
    const isAlreadyParticipant = participants.some((p) => p.id === person.id)
    if (!isAlreadyParticipant) {
      setParticipants([
        ...participants,
        {
          id: person.id,
          name: person.name,
          email: person.email,
          amount: 0,
          usedAmount: 0,
        },
      ])
    }
  }

  // Get the selected payer's name for display
  const getPayerName = () => {
    const payerId = getValues('payer')
    const payer = participants.find((p) => p.id === payerId)
    return payer ? payer.name : 'Chọn người ứng tiền'
  }

  const handleDeleteParticipant = (id) => {
    setParticipants(participants.filter((p) => p.id !== id))
  }

  const handleParticipantAmountChange = (id, amount) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, usedAmount: amount } : p)))
  }

  const handleCalculate = () => {
    const total = parseFloat(totalAmount) || 0
    if (splitType === 'equal' && participants.length > 0) {
      const perPerson = total / participants.length
      setParticipants(participants.map((p) => ({ ...p, amount: perPerson })))
    } else if (splitType === 'by-person') {
      // Calculate based on used amounts
      const totalUsed = participants.reduce((sum, p) => sum + (p.usedAmount || 0), 0)
      if (totalUsed > 0) {
        setParticipants(
          participants.map((p) => ({
            ...p,
            amount: (p.usedAmount / totalUsed) * total,
          }))
        )
      }
    }
  }

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true)
      setSubmitError(null)

      if (!formData.totalAmount || formData.totalAmount <= 0) {
        setSubmitError('Vui lòng nhập số tiền hợp lệ')
        return
      }

      const billData = {
        billName: formData.billName,
        creatorId: currentUser?._id,
        payerId: formData.payer,
        totalAmount: parseFloat(formData.totalAmount),
        paymentDate: formData.creationDate,
        description: formData.notes,
        splittingMethod: formData.splitType,
        category: formData.category,
        participants: participants.map((p) => ({
          userId: p.id,
          name: p.name,
          email: p.email,
          amount: p.amount || 0,
        })),
      }

      console.log('Submitting bill data:', billData)
      //await createBillAPI(billData)
      navigate('/history')
    } catch (error) {
      console.error('Error creating bill:', error)
      setSubmitError(error.response?.data?.message || 'Lỗi khi tạo hóa đơn. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const getInitials = (name) => {
    if (!name) return 'NA'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <Box
      sx={(theme) => ({
        height: '100vh',
        overflow: 'auto',
        backgroundColor: theme.palette.background.default,
      })}
    >
      <IconButton
        sx={(theme) => ({
          position: 'fixed',
          right: '24px',
          top: '16px',
          width: '40px',
          height: '40px',
          backgroundColor: theme.palette.background.default,
          border: `0.8px solid ${theme.palette.divider}`,
          borderRadius: '50%',
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.default,
          },
        })}
      >
        <NotificationsIcon sx={{ width: '16px', height: '16px', color: 'text.primary' }} />
      </IconButton>

      <Box
        sx={{
          padding: '32px',
          maxWidth: '963px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <IconButton
            sx={(theme) => ({
              width: '36px',
              height: '36px',
              borderRadius: '16px',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              },
            })}
            onClick={handleCancel}
          >
            <ArrowBackIcon sx={{ width: '16px', height: '16px' }} />
          </IconButton>
          <Box>
            <Typography
              sx={(theme) => ({
                fontFamily: "'Nunito Sans', sans-serif",
                lineHeight: '36px',
                color: theme.palette.text.primary,
                marginBottom: '4px',
              })}
              style={{ fontSize: '24px', fontWeight: 'bold' }}
            >
              Tạo hóa đơn mới
            </Typography>
            <Typography
              sx={(theme) => ({
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '24px',
                color: theme.palette.text.secondary,
              })}
            >
              Nhập thông tin thủ công
            </Typography>
          </Box>
        </Box>

        {submitError && <FieldErrorAlert message={submitError} />}

        {/* General Information Card */}
        <SectionCard>
          <SectionHeader>
            <InfoOutlinedIcon sx={{ width: '20px', height: '20px', color: 'text.primary' }} />
            <SectionTitle>Thông tin chung</SectionTitle>
          </SectionHeader>

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
                <CustomTextField
                  {...field}
                  label="Ghi chú"
                  placeholder="Thêm mô tả cho hóa đơn..."
                  multiline
                  rows={3}
                />
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
                <CustomDatePicker
                  label="Hạn thanh toán"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                />
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
                    onClick={() => setOpenPayerDialog(true)}
                    sx={(theme) => ({
                      marginTop: '8px',
                      fontSize: '14px',
                      borderRadius: '8px',
                      backgroundColor: theme.palette.background.default,
                      border: `0.8px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
                      color: field.value ? theme.palette.text.primary : theme.palette.text.secondary,
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      padding: '8px 12px',
                      fontWeight: 400,
                      '&:hover': {
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? theme.palette.background.paper
                            : theme.palette.background.default,
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
        </SectionCard>

        {/* Participants Card */}
        <SectionCard>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <SectionHeader sx={{ mb: 0 }}>
              <GroupAddIcon sx={{ width: '20px', height: '20px', color: 'text.primary' }} />
              <SectionTitle>Thành viên tham gia ({participants.length})</SectionTitle>
            </SectionHeader>
            <GradientButton startIcon={<GroupAddIcon />} onClick={() => setOpenParticipantDialog(true)}>
              Thêm thành viên
            </GradientButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {participants.map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                showAmountInput={splitType === 'by-person'}
                onAmountChange={(amount) => handleParticipantAmountChange(participant.id, amount)}
                onDelete={() => handleDeleteParticipant(participant.id)}
                canDelete={participants.length > 1}
              />
            ))}
          </Box>
        </SectionCard>

        {/* Bill Details Card */}
        <SectionCard sx={{ mb: 10 }}>
          <SectionHeader>
            <ReceiptLongIcon sx={{ width: '20px', height: '20px', color: 'text.primary' }} />
            <SectionTitle>Chi tiết hóa đơn</SectionTitle>
          </SectionHeader>

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
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleCalculate}
              sx={{
                borderRadius: '16px',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                border: (theme) => `0.8px solid ${theme.palette.divider}`,
                color: 'text.primary',
                '&:hover': {
                  border: (theme) => `0.8px solid ${theme.palette.divider}`,
                },
              }}
            >
              Tính lại
            </Button>
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
        </SectionCard>
      </Box>

      {/* Fixed Action Buttons */}
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'center',
          position: 'fixed',
          bottom: '0',
          left: '256px',
          right: '0',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: `0.8px solid ${theme.palette.divider}`,
          borderRadius: '16px 16px 0 0',
          padding: '16px',
          gap: '12px',
          zIndex: 1000,
          boxShadow: theme.palette.mode === 'dark' ? '0 -2px 10px rgba(0,0,0,0.3)' : '0 -2px 10px rgba(0,0,0,0.05)',
        })}
      >
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isLoading}
          sx={{
            borderRadius: '16px',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            border: (theme) => `0.8px solid ${theme.palette.divider}`,
            color: 'text.primary',
            '&:hover': {
              border: (theme) => `0.8px solid ${theme.palette.divider}`,
            },
          }}
        >
          Hủy
        </Button>
        <GradientButton
          startIcon={<CheckCircleIcon />}
          onClick={handleFormSubmit(handleSubmit)}
          disabled={isLoading}
          sx={{
            height: '36px',
            px: 2,
          }}
        >
          {isLoading ? 'Đang xử lý...' : 'Lưu hóa đơn'}
        </GradientButton>
      </Box>

      {/* Add Participant Dialog */}
      <AddParticipantDialog
        open={openParticipantDialog}
        onClose={() => setOpenParticipantDialog(false)}
        onAdd={handleAddParticipants}
        availablePeople={mockPeople}
        availableGroups={mockGroups}
      />

      {/* Select Payer Dialog */}
      <SelectPayerDialog
        open={openPayerDialog}
        onClose={() => setOpenPayerDialog(false)}
        onSelect={handleSelectPayer}
        availablePeople={[currentUser, ...mockPeople]}
      />
    </Box>
  )
}

export default BillCreate
