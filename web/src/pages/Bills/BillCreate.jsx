import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { createBillAPI } from '~/apis'

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: '48px !important',
  fontWeight: '400 !important',
  marginBottom: theme.spacing(4),
  color: theme.palette.mode === 'dark' ? '#b39ddb' : '#574d98',
  transition: 'color 0.3s ease',
  [theme.breakpoints.down('md')]: {
    fontSize: '32px !important',
  },
}))

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.mode === 'dark' ? '#6a1b9a' : '#4a148c',
    color: theme.palette.common.white,
    fontWeight: 500,
    fontSize: '16px',
    textAlign: 'center',
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f3e5f5',
  },
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#ede7f6',
  },
}))

const FormGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}))

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginTop: theme.spacing(4),
}))

function BillCreate() {
  const currentUser = useSelector(selectCurrentUser)

  const {
    control,
    handleSubmit,
    // eslint-disable-next-line no-unused-vars
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      billName: '',
      paymentDate: new Date().toISOString().slice(0, 16),
      description: '',
      splittingMethod: 'equal',
      totalAmount: '',
      payerId: currentUser?._id || '',
    },
  })

  const [items, setItems] = useState([{ id: 1, name: 'Item 1', amount: 0, allocatedTo: [] }])

  const [participants, setParticipants] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', amount: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleAddItem = () => {
    if (newItem.name.trim() && newItem.amount) {
      setItems([
        ...items,
        {
          id: Math.max(...items.map((i) => i.id), 0) + 1,
          name: newItem.name,
          amount: parseFloat(newItem.amount) || 0,
          allocatedTo: [],
        },
      ])
      setNewItem({ name: '', amount: '' })
      setOpenDialog(false)
    }
  }

  const handleDeleteItem = (id) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      setSubmitError(null)

      // Validate items
      if (items.length === 0) {
        setSubmitError('Vui lòng thêm ít nhất một item!')
        return
      }

      if (!currentUser?._id) {
        setSubmitError('Lỗi: Không tìm thấy thông tin người dùng!')
        return
      }

      const billData = {
        billName: data.billName,
        creatorId: currentUser._id,
        payerId: data.payerId || currentUser._id,
        totalAmount: parseFloat(data.totalAmount) || 0,
        paymentDate: data.paymentDate,
        description: data.description,
        splittingMethod: data.splittingMethod,
        items: items.map((i) => ({
          name: i.name,
          amount: i.amount,
          allocatedTo: i.allocatedTo,
        })),
        participants: participants,
      }

      await createBillAPI(billData)

      // Reset form on success
      reset()
      setItems([{ id: 1, name: 'Item 1', amount: 0, allocatedTo: [] }])
      setParticipants([])
    } catch (error) {
      console.error('Error creating bill:', error)
      setSubmitError(error.response?.data?.message || 'Lỗi khi tạo hóa đơn. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#121212' : '#fff'),
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <HeaderTitle>Hóa đơn mới</HeaderTitle>
      </Box>

      <Card
        sx={{ boxShadow: 3, borderRadius: 2, bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff') }}
      >
        <CardContent>
          {submitError && <FieldErrorAlert message={submitError} />}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* General Information Section */}
            <Box sx={{ mb: 4 }}>
              <SectionTitle>Thông tin chung</SectionTitle>

              {/* First Row: Bill Name, Date Time, Category */}
              <FormGrid>
                <Controller
                  name="billName"
                  control={control}
                  rules={{ required: 'Tên hóa đơn là bắt buộc' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tên hóa đơn"
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!errors.billName}
                    />
                  )}
                />

                <Controller
                  name="paymentDate"
                  control={control}
                  rules={{ required: 'Ngày thanh toán là bắt buộc' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="datetime-local"
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!errors.paymentDate}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />

                <Controller
                  name="splittingMethod"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel>Cách chia hóa đơn</InputLabel>
                      <Select {...field} label="Cách chia hóa đơn">
                        <MenuItem value="equal">Chia bình quân</MenuItem>
                        <MenuItem value="item-based">Chia theo sản phẩm</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </FormGrid>

              {/* Second Row: Total Amount, Payer ID, Description */}
              <FormGrid>
                <Controller
                  name="totalAmount"
                  control={control}
                  rules={{
                    required: 'Tổng số tiền là bắt buộc',
                    pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Vui lòng nhập số hợp lệ' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tổng số tiền"
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="200000"
                      error={!!errors.totalAmount}
                      type="number"
                    />
                  )}
                />

                <Controller
                  name="payerId"
                  control={control}
                  rules={{ required: 'Người thanh toán là bắt buộc' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="ID người thanh toán"
                      variant="outlined"
                      fullWidth
                      size="small"
                      disabled
                      error={!!errors.payerId}
                    />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Mô tả"
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="Mô tả chi tiết (tùy chọn)"
                    />
                  )}
                />
              </FormGrid>

              {errors.billName && <FieldErrorAlert message={errors.billName.message} />}
              {errors.paymentDate && <FieldErrorAlert message={errors.paymentDate.message} />}
              {errors.totalAmount && <FieldErrorAlert message={errors.totalAmount.message} />}
              {errors.payerId && <FieldErrorAlert message={errors.payerId.message} />}
            </Box>

            {/* Bill Details Section */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <SectionTitle sx={{ mb: 0 }}>Chi tiết hóa đơn</SectionTitle>
                <Button
                  variant="contained"
                  endIcon={<AddIcon />}
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    bgcolor: '#4a148c',
                    '&:hover': { bgcolor: '#6a1b9a' },
                    textTransform: 'uppercase',
                    fontSize: '12px',
                  }}
                >
                  Thêm sản phẩm
                </Button>
              </Box>

              {/* Items Table */}
              <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table>
                  <StyledTableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ width: '50px' }}>
                        STT
                      </TableCell>
                      <TableCell sx={{ minWidth: '200px' }}>Tên sản phẩm</TableCell>
                      <TableCell align="center">Số tiền</TableCell>
                      <TableCell align="center">Xóa</TableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {items.map((item, idx) => (
                      <StyledTableRow key={item.id}>
                        <TableCell align="center">{idx + 1}</TableCell>
                        <TableCell>
                          <TextField
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...items]
                              updated[idx].name = e.target.value
                              setItems(updated)
                            }}
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={item.amount}
                            onChange={(e) => {
                              const updated = [...items]
                              updated[idx].amount = parseFloat(e.target.value) || 0
                              setItems(updated)
                            }}
                            variant="outlined"
                            size="small"
                            sx={{ width: '120px' }}
                            inputProps={{ step: '1000' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleDeleteItem(item.id)} sx={{ color: '#ef5350' }}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Action Buttons */}
              <ButtonGroup>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => reset()}
                  sx={{ textTransform: 'uppercase' }}
                  disabled={isLoading}
                >
                  Xóa hóa đơn
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#e1bee7',
                    color: '#000',
                    textTransform: 'uppercase',
                    '&:hover': { bgcolor: '#ce93d8' },
                  }}
                  startIcon={<CheckCircleIcon />}
                  disabled={isLoading}
                >
                  Quyết toán ngay
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#4a148c',
                    textTransform: 'uppercase',
                    '&:hover': { bgcolor: '#6a1b9a' },
                    position: 'relative',
                  }}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu hóa đơn'}
                </Button>
              </ButtonGroup>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Tên sản phẩm"
            fullWidth
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Số tiền"
            type="number"
            fullWidth
            value={newItem.amount}
            onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
            margin="normal"
            inputProps={{ step: '1000' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleAddItem} variant="contained" sx={{ bgcolor: '#4a148c' }}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BillCreate
