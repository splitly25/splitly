import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: theme.spacing(3),
  color: '#000',
}));

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: '48px',
  fontWeight: 400,
  marginBottom: theme.spacing(4),
  color: '#574d98',
  [theme.breakpoints.down('md')]: {
    fontSize: '32px',
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: '#4a148c',
    color: theme.palette.common.white,
    fontWeight: 500,
    fontSize: '16px',
    textAlign: 'center',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#f3e5f5',
  },
  '&:hover': {
    backgroundColor: '#ede7f6',
  },
}));

const FormGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginTop: theme.spacing(4),
}));

function BillCreate() {
  const { control, handleSubmit, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      billName: '',
      dateTime: new Date().toISOString().slice(0, 16),
      category: 'Ăn uống',
      splitMethod: 'Chia theo sản phẩm',
      initialAmount: '',
      notes: '',
    },
  });

  const [members, setMembers] = useState([
    { id: 1, name: 'Nguyễn Văn A (aina147)', initialAmount: 0, paymentAmount: 0 },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', initialAmount: '', paymentAmount: '' });

  const handleAddMember = () => {
    if (newMember.name.trim()) {
      setMembers([
        ...members,
        {
          id: Math.max(...members.map((m) => m.id), 0) + 1,
          name: newMember.name,
          initialAmount: parseFloat(newMember.initialAmount) || 0,
          paymentAmount: parseFloat(newMember.paymentAmount) || 0,
        },
      ]);
      setNewMember({ name: '', initialAmount: '', paymentAmount: '' });
      setOpenDialog(false);
    }
  };

  const handleDeleteMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const onSubmit = (data) => {
    const billData = {
      ...data,
      members,
      initialAmount: parseFloat(data.initialAmount) || 0,
      totalInitial: members.reduce((sum, m) => sum + m.initialAmount, 0),
      totalPayment: members.reduce((sum, m) => sum + m.paymentAmount, 0),
    };
    console.log('Bill Data:', billData);
    alert('Hóa đơn đã được lưu! Xem console để chi tiết.');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <HeaderTitle>Hóa đơn mới</HeaderTitle>
      </Box>

      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
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
                  name="dateTime"
                  control={control}
                  rules={{ required: 'Thời gian là bắt buộc' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="datetime-local"
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!errors.dateTime}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />

                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel>Phân loại</InputLabel>
                      <Select {...field} label="Phân loại">
                        <MenuItem value="Ăn uống">Ăn uống</MenuItem>
                        <MenuItem value="Du lịch">Du lịch</MenuItem>
                        <MenuItem value="Vui chơi">Vui chơi</MenuItem>
                        <MenuItem value="Khác">Khác</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </FormGrid>

              {/* Second Row: Split Method, Initial Amount, Payment Amount */}
              <FormGrid>
                <Controller
                  name="splitMethod"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel>Cách chia hóa đơn</InputLabel>
                      <Select {...field} label="Cách chia hóa đơn">
                        <MenuItem value="Chia theo sản phẩm">Chia theo sản phẩm</MenuItem>
                        <MenuItem value="Chia bình quân">Chia bình quân</MenuItem>
                        <MenuItem value="Tùy chỉnh">Tùy chỉnh</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="initialAmount"
                  control={control}
                  rules={{
                    required: 'Tổng số tiền ban đầu là bắt buộc',
                    pattern: { value: /^\d+$/, message: 'Vui lòng nhập số' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Tổng số tiền ban đầu"
                      variant="outlined"
                      fullWidth
                      size="small"
                      placeholder="200,000"
                      error={!!errors.initialAmount}
                    />
                  )}
                />

                <Box sx={{ p: 1, border: '1px solid #ccc', borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Tổng số tiền thanh toán: <strong>0 đ</strong>
                  </Typography>
                </Box>
              </FormGrid>

              {/* Notes */}
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Ghi chú"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                )}
              />

              {errors.billName && <FieldErrorAlert message={errors.billName.message} />}
              {errors.dateTime && <FieldErrorAlert message={errors.dateTime.message} />}
              {errors.initialAmount && <FieldErrorAlert message={errors.initialAmount.message} />}
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
                  Thêm thành viên
                </Button>
              </Box>

              {/* Members Table */}
              <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Table>
                  <StyledTableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ width: '50px' }}>
                        STT
                      </TableCell>
                      <TableCell sx={{ minWidth: '200px' }}>Họ và tên</TableCell>
                      <TableCell align="center">Số tiền ban đầu</TableCell>
                      <TableCell align="center">Số tiền thanh toán</TableCell>
                      <TableCell align="center">Xóa thành viên</TableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {members.map((member, idx) => (
                      <StyledTableRow key={member.id}>
                        <TableCell align="center">{idx + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: '#bdbdbd', width: 42, height: 42 }}>
                              {member.name.substring(0, 1)}
                            </Avatar>
                            <Typography variant="body2">{member.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={member.initialAmount}
                            onChange={(e) => {
                              const updated = [...members];
                              updated[idx].initialAmount = parseFloat(e.target.value) || 0;
                              setMembers(updated);
                            }}
                            variant="outlined"
                            size="small"
                            sx={{ width: '120px' }}
                            inputProps={{ step: '1000' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="number"
                            value={member.paymentAmount}
                            onChange={(e) => {
                              const updated = [...members];
                              updated[idx].paymentAmount = parseFloat(e.target.value) || 0;
                              setMembers(updated);
                            }}
                            variant="outlined"
                            size="small"
                            sx={{ width: '120px' }}
                            inputProps={{ step: '1000' }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteMember(member.id)}
                            sx={{ color: '#ef5350' }}
                          >
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
                >
                  Quyết toán ngay
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#4a148c',
                    textTransform: 'uppercase',
                    '&:hover': { bgcolor: '#6a1b9a' },
                  }}
                  startIcon={<SaveIcon />}
                  type="submit"
                >
                  Lưu hóa đơn
                </Button>
              </ButtonGroup>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm thành viên mới</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Tên thành viên"
            fullWidth
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Số tiền ban đầu"
            type="number"
            fullWidth
            value={newMember.initialAmount}
            onChange={(e) => setNewMember({ ...newMember, initialAmount: e.target.value })}
            margin="normal"
            inputProps={{ step: '1000' }}
          />
          <TextField
            label="Số tiền thanh toán"
            type="number"
            fullWidth
            value={newMember.paymentAmount}
            onChange={(e) => setNewMember({ ...newMember, paymentAmount: e.target.value })}
            margin="normal"
            inputProps={{ step: '1000' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            onClick={handleAddMember}
            variant="contained"
            sx={{ bgcolor: '#4a148c' }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BillCreate;
