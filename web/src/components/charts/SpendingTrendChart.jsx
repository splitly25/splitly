import { Card, CardContent, Typography, Box, useTheme, useMediaQuery } from '@mui/material'
import { BarChart as BarChartIcon } from '@mui/icons-material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { COLORS } from '~/theme'

/**
 * Sample data structure for spending trend
 * @typedef {Object} SpendingTrendData
 * @property {string} date - Date in 'YYYY-MM-DD' format
 * @property {number} totalAmount - Total spending amount
 * @property {number} billCount - Number of bills
 */

/**
 * Spending Trend Line Chart Component
 * Displays spending amount and bill count trends over time with dual Y-axes
 *
 * @param {Object} props
 * @param {SpendingTrendData[]} props.data - Array of spending trend data
 * @param {string} props.title - Chart title
 */
const SpendingTrendChart = ({ data = [], title = 'Xu hướng chi tiêu' }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  // Format data for display - convert daily data to weekly if too many points
  const formatData = (rawData) => {
    if (rawData.length === 0) return []

    // If more than 15 data points on mobile, aggregate by week
    if (isMobile && rawData.length > 15) {
      return aggregateByWeek(rawData)
    }

    return rawData.map((item) => ({
      ...item,
      displayDate: formatDate(item.date),
    }))
  }

  // Aggregate daily data into weekly data
  const aggregateByWeek = (dailyData) => {
    const weeks = {}

    dailyData.forEach((item) => {
      const date = new Date(item.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split('T')[0]

      if (!weeks[weekKey]) {
        weeks[weekKey] = {
          date: weekKey,
          totalAmount: 0,
          billCount: 0,
          displayDate: formatDate(weekKey, true),
        }
      }

      weeks[weekKey].totalAmount += item.totalAmount || item.amount || 0
      weeks[weekKey].billCount += item.billCount || 0
    })

    return Object.values(weeks)
  }

  // Format date for display
  const formatDate = (dateString, isWeek = false) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth() + 1

    if (isWeek) {
      return `Tuần ${day}/${month}`
    }

    return `${day}/${month}`
  }

  // Format currency for tooltip
  const formatCurrency = (value) => {
    return `${Math.round(value).toLocaleString('vi-VN')} ₫`
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null

    return (
      <Card
        sx={{
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid',
          borderColor: 'divider',
          minWidth: 180,
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              fontSize: '13px',
              color: 'text.primary',
              mb: 1,
            }}
          >
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                mb: 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: entry.color,
                  }}
                />
                <Typography variant="body2" sx={{ fontSize: '12px', color: 'text.secondary' }}>
                  {entry.name}:
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                {entry.dataKey === 'totalAmount' ? formatCurrency(entry.value) : entry.value}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    )
  }

  // Calculate max values for Y-axis domain
  const maxAmount = Math.max(...formatData(data).map((d) => d.totalAmount || d.amount || 0))
  const maxCount = Math.max(...formatData(data).map((d) => d.billCount || 0))

  const formattedData = formatData(data)
  const hasData = formattedData.length > 0 && formattedData.some((d) => d.totalAmount > 0 || d.billCount > 0)

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
          Biểu đồ chi tiêu và số lượng hóa đơn theo {isMobile && formattedData.length > 15 ? 'tuần' : 'ngày'}
        </Typography>

        {!hasData ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontSize: '14px',
              }}
            >
              Không có dữ liệu trong kỳ này
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
                margin={{
                  top: 5,
                  right: isMobile ? 10 : 30,
                  left: isMobile ? 0 : 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} opacity={0.5} />
                
                {/* X Axis - Date */}
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                  tickLine={{ stroke: theme.palette.divider }}
                  axisLine={{ stroke: theme.palette.divider }}
                  interval={isMobile ? 'preserveStartEnd' : 0}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 60 : 40}
                />

                {/* Left Y Axis - Amount */}
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                  tickLine={{ stroke: theme.palette.divider }}
                  axisLine={{ stroke: theme.palette.divider }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                    return value
                  }}
                  width={isMobile ? 40 : 60}
                  label={
                    !isMobile && {
                      value: 'Số tiền (₫)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 12, fill: theme.palette.text.secondary },
                    }
                  }
                />

                {/* Right Y Axis - Bill Count */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                  tickLine={{ stroke: theme.palette.divider }}
                  axisLine={{ stroke: theme.palette.divider }}
                  width={isMobile ? 30 : 50}
                  label={
                    !isMobile && {
                      value: 'Số hóa đơn',
                      angle: 90,
                      position: 'insideRight',
                      style: { fontSize: 12, fill: theme.palette.text.secondary },
                    }
                  }
                />

                <Tooltip content={<CustomTooltip />} />

                <Legend
                  wrapperStyle={{
                    fontSize: isMobile ? 11 : 12,
                    paddingTop: 10,
                  }}
                  iconType="line"
                />

                {/* Total Amount Line */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalAmount"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  name="Tổng chi tiêu"
                  dot={{
                    fill: COLORS.primary,
                    strokeWidth: 2,
                    r: isMobile ? 3 : 4,
                  }}
                  activeDot={{
                    r: isMobile ? 5 : 6,
                    fill: COLORS.primary,
                  }}
                />

                {/* Bill Count Line */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="billCount"
                  stroke="#2196F3"
                  strokeWidth={2}
                  name="Số hóa đơn"
                  dot={{
                    fill: '#2196F3',
                    strokeWidth: 2,
                    r: isMobile ? 3 : 4,
                  }}
                  activeDot={{
                    r: isMobile ? 5 : 6,
                    fill: '#2196F3',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default SpendingTrendChart
