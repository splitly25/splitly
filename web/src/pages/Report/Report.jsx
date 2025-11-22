import Layout from '~/components/Layout'
import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  Avatar,
} from '@mui/material'
import {
  CalendarMonth as CalendarIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  AutoAwesome as AutoAwesomeIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material'
import { COLORS } from '~/theme'

// Metric Card Component
const MetricCard = ({ icon, title, value, subtitle, iconBgColor, iconColor }) => {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        backgroundColor: 'background.paper',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: iconBgColor,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '24px', sm: '28px' },
            color: 'text.primary',
            mb: 0.5,
          }}
        >
          {value}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '12px',
          }}
        >
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  )
}

// Empty State Component
const EmptyChart = ({ title, message }) => {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '16px',
            color: 'text.primary',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <BarChartIcon sx={{ fontSize: 20, color: COLORS.primary }} />
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px', mb: 3 }}>
          {title === 'Xu hướng chi tiêu' ? 'Biểu đồ chi tiêu theo ngày trong kỳ' : ''}
        </Typography>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: '14px',
            }}
          >
            {message}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

// AI Insight Card Component
const AIInsightCard = ({ title, description, suggestion }) => {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        mb: 3,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              background: COLORS.gradientPrimary,
            }}
          >
            <AutoAwesomeIcon sx={{ color: 'white', fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '18px',
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              Gợi ý từ AI
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontSize: '13px',
              }}
            >
              Phân tích thông minh và đề xuất cải thiện từ TingTing AI
            </Typography>
          </Box>
        </Box>

        {/* Insight Content */}
        <Card
          sx={{
            borderRadius: '12px',
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 'none',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  flexShrink: 0,
                }}
              >
                <TrendingUpIcon sx={{ color: '#2196F3', fontSize: 24 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    fontSize: '15px',
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '14px',
                    mb: 1.5,
                    lineHeight: 1.6,
                  }}
                >
                  {description}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    backgroundColor: 'rgba(239, 154, 154, 0.08)',
                    borderRadius: '8px',
                    p: 1.5,
                    border: '1px solid rgba(239, 154, 154, 0.2)',
                  }}
                >
                  <LightbulbIcon
                    sx={{
                      color: COLORS.primary,
                      fontSize: 18,
                      flexShrink: 0,
                      mt: 0.2,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.primary',
                      fontSize: '13px',
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Gợi ý:</strong> {suggestion}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

const Report = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  const [period, setPeriod] = useState('month')
  const [activeTab, setActiveTab] = useState(0)

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Mock data - replace with actual API data
  const metrics = [
    {
      icon: <TrendingUpIcon sx={{ color: '#E91E63', fontSize: 20 }} />,
      title: 'Tổng chi tiêu',
      value: '0 ₫',
      subtitle: '0% so với kỳ trước',
      iconBgColor: 'rgba(233, 30, 99, 0.1)',
      iconColor: '#E91E63',
    },
    {
      icon: <ReceiptIcon sx={{ color: '#9C27B0', fontSize: 20 }} />,
      title: 'Số hóa đơn',
      value: '0',
      subtitle: '0% so với kỳ trước',
      iconBgColor: 'rgba(156, 39, 176, 0.1)',
      iconColor: '#9C27B0',
    },
    {
      icon: <ScheduleIcon sx={{ color: '#FF9800', fontSize: 20 }} />,
      title: 'Hóa đơn quá hạn',
      value: '0',
      subtitle: 'Không có hóa đơn quá hạn',
      iconBgColor: 'rgba(255, 152, 0, 0.1)',
      iconColor: '#FF9800',
    },
    {
      icon: <CheckCircleIcon sx={{ color: '#00BCD4', fontSize: 20 }} />,
      title: 'Không có nợ',
      value: '—',
      subtitle: 'Tất cả đã thanh toán',
      iconBgColor: 'rgba(0, 188, 212, 0.1)',
      iconColor: '#00BCD4',
    },
  ]

  return (
    <Layout>
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '24px', sm: '28px', md: '32px' },
              color: 'text.primary',
              mb: 1,
            }}
          >
            Báo cáo &amp; Phân tích
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '13px', sm: '14px' },
            }}
          >
            Tổng quan chi tiêu ý từ AI
          </Typography>
        </Box>

        {/* Period Selector Card */}
        <Card
          sx={{
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            mb: 3,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flex: 1,
                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                }}
              >
                <CalendarIcon sx={{ color: COLORS.primary, fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  Kỳ báo cáo:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'text.primary',
                  }}
                >
                  01/11/2025 - 30/11/2025
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  width: { xs: '100%', sm: 'auto' },
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                  <Select
                    value={period}
                    onChange={handlePeriodChange}
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: 'background.default',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'divider',
                      },
                    }}
                  >
                    <MenuItem value="day">Hôm nay</MenuItem>
                    <MenuItem value="week">Tuần này</MenuItem>
                    <MenuItem value="month">Tháng này</MenuItem>
                    <MenuItem value="quarter">Quý này</MenuItem>
                    <MenuItem value="year">Năm này</MenuItem>
                    <MenuItem value="custom">Tùy chọn</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    borderColor: 'divider',
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '14px',
                    px: 2.5,
                    '&:hover': {
                      borderColor: COLORS.primary,
                      backgroundColor: 'rgba(239, 154, 154, 0.05)',
                    },
                  }}
                >
                  Xuất báo cáo
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
            mb: 4,
          }}
        >
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </Box>

        {/* AI Insight Section */}
        <AIInsightCard
          title="Phân tích chi tiêu trung bình"
          description="Trung bình bạn chi 0 ₫ cho mỗi giao dịch. Số giao dịch giảm 0% so với tháng trước."
          suggestion="Duy trì mức chi tiêu ổn định này"
        />

        {/* Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: COLORS.primary,
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 500,
                color: 'text.secondary',
                minWidth: { xs: 'auto', sm: 120 },
                px: { xs: 2, sm: 3 },
                '&.Mui-selected': {
                  color: COLORS.primary,
                  fontWeight: 600,
                },
              },
            }}
          >
            <Tab label="Tổng quan" />
            <Tab label="Danh mục" />
            <Tab label="Nhóm" />
          </Tabs>
        </Box>

        {/* Charts Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'repeat(2, 1fr)',
            },
            gap: { xs: 2.5, md: 3 },
          }}
        >
          <EmptyChart title="Xu hướng chi tiêu" message="Không có dữ liệu trong kỳ này" />
          <EmptyChart title="Chi tiêu theo danh mục" message="Không có dữ liệu" />
        </Box>
      </Box>
    </Layout>
  )
}

export default Report
