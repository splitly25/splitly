import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Card,
  CardContent,
  Grid,
} from '@mui/material'
import {
  ArrowBack,
  Add,
  People,
  Receipt,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  ErrorOutline,
  CheckCircle,
  Lightbulb,
  BarChart,
} from '@mui/icons-material'
import Layout from '~/components/Layout'
import { COLORS } from '~/theme'
import { getGroupByIdAPI, updateGroupMembersAPI } from '~/apis'
import { getInitials } from '~/utils/formatters'
import LoadingSpinner from '~/components/Loading/LoadingSpinner'
import ManageMembersDialog from '~/components/Group/ManageMembersDialog'

function GroupDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [manageMembersOpen, setManageMembersOpen] = useState(false)

  const fetchGroupData = useCallback(async () => {
    setLoading(true)
    const response = await getGroupByIdAPI(id)
    setGroup(response)
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchGroupData()
  }, [fetchGroupData])

  const handleSaveMembers = async (memberIds) => {
    await updateGroupMembersAPI(id, memberIds)
    setManageMembersOpen(false)
    // Refresh group data
    fetchGroupData()
  }

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <LoadingSpinner caption="Đang tải thông tin nhóm..." />
        </Box>
      </Layout>
    )
  }

  if (!group) {
    return (
      <Layout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Không tìm thấy nhóm</Typography>
        </Box>
      </Layout>
    )
  }

  const memberCount = group.members?.length || 0
  const billCount = group.bills?.length || 0

  // Mock statistics - replace with actual data from API
  const stats = {
    totalBills: billCount,
    totalSpent: 5000000,
    paid: 0,
    unpaid: 5000000,
  }

  // Mock insights - replace with actual data from API
  const insights = {
    mostOwed: { name: 'Nguyễn Văn A', amount: 3500000 },
    upToDate: { name: 'Nguyễn Văn A', count: 8 },
    earlyPaid: { name: 'Nguyễn Văn A', count: 0 },
    latePaid: { name: 'Nguyễn Văn A', count: 1, detail: 'Nguyễn Văn A' },
  }

  return (
    <Layout>
      <Box
        sx={{
          padding: { xs: 2, sm: 3, md: 4 },
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton
              onClick={() => navigate('/groups')}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
              >
                {group.groupName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {memberCount} thành viên • {billCount} hóa đơn
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              sx={{
                background: COLORS.gradientPrimary,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: COLORS.gradientPrimary,
                  opacity: 0.9,
                },
              }}
            >
              Tạo hóa đơn theo nhóm
            </Button>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Receipt />}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}
            >
              Danh sách hóa đơn
            </Button>
            <Button
              variant="outlined"
              startIcon={<People />}
              onClick={() => setManageMembersOpen(true)}
              sx={{
                background: COLORS.gradientPrimary,
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                border: 'none',
                '&:hover': {
                  background: COLORS.gradientPrimary,
                  opacity: 0.9,
                  border: 'none',
                },
              }}
            >
              Quản lý nhóm
            </Button>
          </Box>
        </Box>

        {/* Members Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People sx={{ color: 'text.primary' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Thành viên ({memberCount})
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => setManageMembersOpen(true)}
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                fontSize: '14px',
              }}
            >
              Quản lý thành viên
            </Button>
          </Box>
          <Grid container spacing={2}>
            {group.members?.map((member) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={member._id}>
                <Card
                  sx={{
                    borderRadius: '16px',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        background: COLORS.gradientPrimary,
                      }}
                    >
                      {getInitials(member.name || member.email)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {member.name || 'Unknown'}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {member.email}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: '16px',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: 'info.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Receipt sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tổng hóa đơn
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {stats.totalBills}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: '16px',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AttachMoney sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tổng chi tiêu
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {stats.totalSpent.toLocaleString('vi-VN')} ₫
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: '16px',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Đã thanh toán
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {stats.paid.toLocaleString('vi-VN')} ₫
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                borderRadius: '16px',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: 'warning.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingDown sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Chưa thanh toán
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {stats.unpaid.toLocaleString('vi-VN')} ₫
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Smart Insights Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Lightbulb sx={{ color: 'secondary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Phân tích thông minh
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: (theme) => `1px solid ${theme.palette.error.light}`,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.08)' : 'error.lighter',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <ErrorOutline sx={{ color: 'error.dark', mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Nợ nhiều nhất
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.dark' }}>
                        {insights.mostOwed.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'error.dark' }}>
                        Đang nợ: {insights.mostOwed.amount.toLocaleString('vi-VN')} ₫
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: (theme) => `1px solid ${theme.palette.success.light}`,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.08)' : 'success.lighter',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <CheckCircle sx={{ color: 'success.dark', mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Nền ứng trước kỳ này
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.dark' }}>
                        {insights.upToDate.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'success.dark' }}>
                        Lịch sử thanh toán tốt ({insights.upToDate.count} lần)
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: (theme) => `1px solid ${theme.palette.info.light}`,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.08)' : 'info.lighter',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <TrendingUp sx={{ color: 'info.dark', mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Xu hướng trả sớm
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'info.dark' }}>
                        {insights.earlyPaid.count} thành viên
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: (theme) => `1px solid ${theme.palette.warning.light}`,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.08)' : 'warning.lighter',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <TrendingDown sx={{ color: 'warning.dark', mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Xu hướng trả muộn
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                        {insights.latePaid.count} thành viên
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                        {insights.latePaid.detail}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255, 235, 59, 0.08)' : 'rgba(255, 235, 59, 0.12)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Lightbulb sx={{ color: 'warning.dark', mt: 0.5 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Khuyến nghị
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.dark', mb: 1 }}>
                        Nên thay đổi chế độ thu chi
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Tỷ lệ thanh toán thấp, cần nhắc thủ liên trước.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Detailed Report Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BarChart sx={{ color: 'text.primary' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Báo cáo chi tiêu
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Chi tiêu theo danh mục
                  </Typography>
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
                      borderRadius: '12px',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Danh mục chi nhiều nhất
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                      N/A
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: '16px',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Tổng quan
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? 'rgba(156, 39, 176, 0.08)' : 'secondary.lighter',
                        borderRadius: '12px',
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Chi tiêu trung bình
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        1.666.667 ₫
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        MN/hóa đơn
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.08)' : 'success.lighter',
                        borderRadius: '12px',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Tỷ lệ thanh toán
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                        0.0
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        %
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Manage Members Dialog */}
      <ManageMembersDialog
        open={manageMembersOpen}
        onClose={() => setManageMembersOpen(false)}
        groupName={group.groupName}
        currentMembers={group.members || []}
        onSave={handleSaveMembers}
      />
    </Layout>
  )
}

export default GroupDetails
