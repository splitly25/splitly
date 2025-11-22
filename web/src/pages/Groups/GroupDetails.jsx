import React, { useState } from 'react'
import { Box, Typography, Button, Avatar, Grid, IconButton, Container, Stack, Paper } from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Receipt as ReceiptIcon,
  Groups as GroupsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Lightbulb as LightbulbIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Recommend as RecommendIcon,
  AccountBalanceWallet as WalletIcon,
  Paid as PaidIcon,
  MoneyOff as MoneyOffIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '~/theme'
import Layout from '~/components/Layout'

const groupData = {
  id: 1,
  name: 'Gia đình',
  memberCount: 2,
  billCount: 3,
  totalAmount: 5000000,
  paidAmount: 0,
  unpaidAmount: 5000000,
  members: [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      initials: 'NA',
      isCurrentUser: true,
    },
    {
      id: 2,
      name: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      initials: 'HE',
      isCurrentUser: false,
    },
    {
      id: 3,
      name: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      initials: 'HE',
      isCurrentUser: false,
    },
    {
      id: 4,
      name: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      initials: 'HE',
      isCurrentUser: false,
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      initials: 'HE',
      isCurrentUser: false,
    },
    {
      id: 6,
      name: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      initials: 'HE',
      isCurrentUser: false,
    },
    {
      id: 7,
      name: 'Hoàng Văn E',
      email: 'hoangvane@example.com',
      initials: 'HE',
      isCurrentUser: false,
    },
  ],
  statistics: [
    {
      title: 'Tổng hóa đơn',
      value: '3',
      icon: <ReceiptIcon sx={{ color: 'white' }} />,
      color: '#2b7fff',
    },
    {
      title: 'Tổng chi tiêu',
      value: '5.000.000 ₫',
      icon: <WalletIcon sx={{ color: 'white' }} />,
      color: '#ad46ff',
    },
    {
      title: 'Đã thanh toán',
      value: '0 ₫',
      icon: <PaidIcon sx={{ color: 'white' }} />,
      color: '#00c950',
    },
    {
      title: 'Chưa thanh toán',
      value: '5.000.000 ₫',
      icon: <MoneyOffIcon sx={{ color: 'white' }} />,
      color: '#ff6900',
    },
  ],
  insights: [
    {
      title: 'Nợ nhiều nhất',
      value: 'Nguyễn Văn A',
      description: 'Đang nợ: 3.500.000 ₫',
      titleColor: '#c10007',
      descColor: '#e7000b',
      bgColor: '#fef2f2',
      borderColor: '#ffc9c9',
      icon: <TrendingDownIcon />,
      iconColor: '#c10007',
    },
    {
      title: 'Nên ứng trước kỳ này',
      value: 'Nguyễn Văn A',
      description: 'Lịch sử thanh toán tốt (8 lần)',
      titleColor: '#008236',
      descColor: '#00a63e',
      bgColor: '#f0fdf4',
      borderColor: '#b9f8cf',
      icon: <CheckCircleIcon />,
      iconColor: '#008236',
    },
    {
      title: 'Xu hướng trả sớm',
      value: '0 thành viên',
      description: '',
      titleColor: '#1447e6',
      descColor: '#1447e6',
      bgColor: '#eff6ff',
      borderColor: '#bedbff',
      icon: <ScheduleIcon />,
      iconColor: '#1447e6',
    },
    {
      title: 'Xu hướng trả muộn',
      value: '1 thành viên',
      description: 'Hoàng Văn E',
      titleColor: '#ca3500',
      descColor: '#f54900',
      bgColor: '#fff7ed',
      borderColor: '#ffd6a7',
      icon: <WarningIcon />,
      iconColor: '#ca3500',
    },
    {
      title: 'Nợ tăng liên tục',
      value: '1 thành viên',
      description: 'Nguyễn Văn A',
      titleColor: '#8200db',
      descColor: '#9810fa',
      bgColor: '#faf5ff',
      borderColor: '#e9d4ff',
      icon: <TrendingUpIcon />,
      iconColor: '#8200db',
    },
    {
      title: 'Khuyến nghị',
      value: 'Nên thay đổi chế độ thu chi',
      description: 'Tỷ lệ thanh toán thấp, cân nhắc thu tiền trước',
      titleColor: '#bb4d00',
      descColor: '#e17100',
      bgColor: '#fefce8',
      borderColor: '#fee685',
      icon: <RecommendIcon />,
      iconColor: '#bb4d00',
    },
  ],
}

const GroupDetails = () => {
  const navigate = useNavigate()
  const [currentTab, setCurrentTab] = useState(1) // 0: Danh sách hóa đơn, 1: Quản lý nhóm

  // Mock data - trong thực tế sẽ lấy từ API

  const handleGoBack = () => {
    navigate('/groups')
  }

  const handleCreateBill = () => {
    navigate('/bills/create', { state: { groupId: groupData.id } })
  }

  const handleManageMembers = () => {
    console.log('Quản lý thành viên')
  }

  const gradientButtonStyle = {
    background: COLORS.gradientPrimary,
    color: 'white',
    borderRadius: '16px',
    textTransform: 'none',
    fontWeight: 400,
    boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
    '&:hover': {
      boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.15), 0px 4px 6px -4px rgba(0,0,0,0.15)',
    },
  }

  const iconButtonStyle = {
    width: 46,
    height: 46,
    bgcolor: 'white',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: '16px',
    '&:hover': {
      bgcolor: 'grey.50',
    },
  }

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Stack spacing={4}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={handleGoBack} sx={iconButtonStyle}>
                  <ArrowBackIcon />
                </IconButton>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: 'text.primary',
                    }}
                  >
                    {groupData.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: 'text.secondary',
                    }}
                  >
                    {groupData.memberCount} thành viên • {groupData.billCount} hóa đơn
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleCreateBill}
                  sx={{
                    ...gradientButtonStyle,
                    px: 3,
                    py: 1.5,
                    height: 48,
                  }}
                >
                  Tạo hóa đơn theo nhóm
                </Button>
                <IconButton sx={iconButtonStyle}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Tab Navigation */}
            <Paper
              sx={{
                borderRadius: '16px',
                border: '1px solid',
                borderColor: 'divider',
                p: 1,
                display: 'flex',
                gap: 1,
              }}
            >
              <Box
                onClick={() => setCurrentTab(0)}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  py: 1.5,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: currentTab === 0 ? COLORS.gradientPrimary : 'transparent',
                  '&:hover': {
                    bgcolor: currentTab === 0 ? undefined : 'grey.100',
                  },
                }}
              >
                <ReceiptIcon sx={{ fontSize: 20, color: currentTab === 0 ? 'white' : 'text.secondary' }} />
                <Typography
                  sx={{
                    fontSize: '16px',
                    color: currentTab === 0 ? 'white' : 'text.secondary',
                  }}
                >
                  Danh sách hóa đơn
                </Typography>
              </Box>
              <Box
                onClick={() => setCurrentTab(1)}
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  py: 1.5,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: currentTab === 1 ? COLORS.gradientPrimary : 'transparent',
                  '&:hover': {
                    bgcolor: currentTab === 1 ? undefined : 'grey.100',
                  },
                }}
              >
                <GroupsIcon sx={{ fontSize: 20, color: currentTab === 1 ? 'white' : 'text.secondary' }} />
                <Typography
                  sx={{
                    fontSize: '16px',
                    color: currentTab === 1 ? 'white' : 'text.secondary',
                  }}
                >
                  Quản lý nhóm
                </Typography>
              </Box>
            </Paper>

            {/* Tab Content */}
            {currentTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Danh sách hóa đơn
                </Typography>
                {/* Content for bill list will be added here */}
              </Box>
            )}

            {currentTab === 1 && (
              <Stack spacing={3}>
                {/* Members Section */}
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupsIcon sx={{ fontSize: 20 }} />
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontFamily: "'Nunito Sans', sans-serif",
                          fontSize: '16px',
                        }}
                      >
                        Thành viên
                      </Typography>
                      <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                        ({groupData.memberCount})
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={handleManageMembers}
                      sx={{
                        bgcolor: 'grey.50',
                        color: 'text.primary',
                        borderRadius: '14px',
                        textTransform: 'none',
                        fontSize: '14px',
                        px: 2,
                        py: 1,
                        boxShadow: 'none',
                        '&:hover': {
                          bgcolor: 'grey.100',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      Quản lý thành viên
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(auto-fit, minmax(280px, 1fr))',
                      },
                      gap: 2,
                      maxWidth: '100%',
                    }}
                  >
                    {groupData.members.slice(0, 6).map((member) => (
                      <Box
                        key={member.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          height: 90,
                          bgcolor: '#fafafa',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: '16px',
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            background: COLORS.gradientPrimary,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            borderRadius: '50%',
                          }}
                        >
                          {member.initials}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: '16px',
                              lineHeight: '24px',
                              color: 'text.primary',
                              fontWeight: 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {member.name} {member.isCurrentUser && '(Bạn)'}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '12px',
                              lineHeight: '16px',
                              color: 'text.secondary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {member.email}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  {groupData.members.length > 6 && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          color: 'text.secondary',
                          fontWeight: 500,
                        }}
                      >
                        ... và {groupData.members.length - 6} thành viên khác
                      </Typography>
                    </Box>
                  )}
                </Paper>

                {/* Statistics */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(4, 1fr)',
                    },
                    gap: 2,
                  }}
                >
                  {groupData.statistics.map((stat, index) => (
                    <Paper
                      key={index}
                      sx={{
                        p: 3,
                        height: 98,
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            minWidth: 48,
                            borderRadius: '16px',
                            bgcolor: stat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {stat.icon}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: '14px', lineHeight: '20px', color: 'text.secondary' }}>
                            {stat.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '16px',
                              lineHeight: '24px',
                              fontWeight: 700,
                              color: 'text.primary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>

                {/* Smart Analytics */}
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <LightbulbIcon sx={{ fontSize: 20 }} />
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: '16px',
                      }}
                    >
                      Phân tích thông minh
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, 1fr)',
                      },
                      gap: 2,
                    }}
                  >
                    {groupData.insights.map((insight, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          height: 106,
                          bgcolor: insight.bgColor,
                          border: '1px solid',
                          borderColor: insight.borderColor,
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
                          <Box sx={{ color: insight.iconColor, mt: 0.5, minWidth: 20 }}>{insight.icon}</Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: '14px', lineHeight: '20px', color: insight.titleColor }}>
                              {insight.title}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '16px',
                                lineHeight: '24px',
                                fontWeight: 700,
                                color: 'text.primary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {insight.value}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '14px',
                                lineHeight: '20px',
                                color: insight.descColor,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                minHeight: 20,
                              }}
                            >
                              {insight.description || '\u00A0'}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Paper>

                {/* Expense Report */}
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <AssessmentIcon sx={{ fontSize: 20 }} />
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: '16px',
                      }}
                    >
                      Báo cáo chi tiêu
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, 1fr)',
                      },
                      gap: 3,
                      alignItems: 'stretch',
                    }}
                  >
                    {/* Category Spending */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontFamily: "'Nunito Sans', sans-serif",
                          fontSize: '16px',
                          mb: 2,
                        }}
                      >
                        Chi tiêu theo danh mục
                      </Typography>
                      <Box
                        sx={{
                          p: 2,
                          flex: 1,
                          bgcolor: '#eff6ff',
                          border: '1px solid',
                          borderColor: '#bedbff',
                          borderRadius: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: '14px', lineHeight: '20px', color: '#155dfc' }}>
                          Danh mục chi nhiều nhất
                        </Typography>
                        <Typography sx={{ fontSize: '16px', lineHeight: '24px', fontWeight: 700, color: '#1c398e' }}>
                          N/A
                        </Typography>
                      </Box>
                    </Box>

                    {/* Overview */}
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontFamily: "'Nunito Sans', sans-serif",
                          fontSize: '16px',
                          mb: 2,
                        }}
                      >
                        Tổng quan
                      </Typography>
                      <Stack spacing={1.5} sx={{ flex: 1 }}>
                        {/* Average Spending */}
                        <Box
                          sx={{
                            p: 2,
                            flex: 1,
                            bgcolor: '#faf5ff',
                            border: '1px solid',
                            borderColor: '#e9d4ff',
                            borderRadius: '14px',
                          }}
                        >
                          <Typography sx={{ fontSize: '14px', lineHeight: '20px', color: '#9810fa' }}>
                            Chi tiêu trung bình
                          </Typography>
                          <Typography sx={{ fontSize: '16px', lineHeight: '24px', fontWeight: 700, color: '#59168b' }}>
                            1.666.667 ₫
                          </Typography>
                          <Typography sx={{ fontSize: '12px', lineHeight: '16px', color: '#9810fa' }}>
                            Mỗi hóa đơn
                          </Typography>
                        </Box>

                        {/* Payment Rate */}
                        <Box
                          sx={{
                            p: 2,
                            flex: 1,
                            bgcolor: '#f0fdf4',
                            border: '1px solid',
                            borderColor: '#b9f8cf',
                            borderRadius: '14px',
                          }}
                        >
                          <Typography sx={{ fontSize: '14px', lineHeight: '20px', color: '#00a63e' }}>
                            Tỷ lệ thanh toán
                          </Typography>
                          <Typography sx={{ fontSize: '16px', lineHeight: '24px', fontWeight: 700, color: '#0d542b' }}>
                            0.0%
                          </Typography>
                          <Box
                            sx={{
                              width: '100%',
                              height: 6,
                              bgcolor: 'grey.200',
                              borderRadius: '100px',
                              mt: 1,
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              sx={{
                                width: '0%',
                                height: '100%',
                                background: 'linear-gradient(90deg, #00c950, #00a63e)',
                                borderRadius: '100px',
                              }}
                            />
                          </Box>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </Paper>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
    </Layout>
  )
}

export default GroupDetails
