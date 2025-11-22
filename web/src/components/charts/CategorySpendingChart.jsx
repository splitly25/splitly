import { Card, CardContent, Typography, Box, useTheme, useMediaQuery } from '@mui/material'
import { PieChart as PieChartIcon } from '@mui/icons-material'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts'
import { COLORS } from '~/theme'
import { categoryOptions } from '~/apis/mock-data'

/**
 * Sample data structure for category spending
 * @typedef {Object} CategorySpendingData
 * @property {string} category - Category name
 * @property {number} amount - Spending amount in the category
 */

/**
 * Category color palette - predefined colors for consistency
 */
const CATEGORY_COLORS = [
  '#EF9A9A', // Light pink/red - primary theme
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#673AB7', // Deep purple
  '#3F51B5', // Indigo
  '#2196F3', // Blue
  '#00BCD4', // Cyan
  '#009688', // Teal
  '#4CAF50', // Green
  '#8BC34A', // Light green
  '#CDDC39', // Lime
  '#FFEB3B', // Yellow
  '#FFC107', // Amber
  '#FF9800', // Orange
  '#FF5722', // Deep orange
  '#795548', // Brown
  '#9E9E9E', // Grey
  '#607D8B', // Blue grey
]

/**
 * Category Spending Pie Chart Component
 * Displays spending distribution across categories
 *
 * @param {Object} props
 * @param {CategorySpendingData[]} props.data - Array of category spending data
 * @param {string} props.title - Chart title
 */
const CategorySpendingChart = ({ data = [], title = 'Chi tiêu theo danh mục' }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))

  // Create a mapping from category value to label
  const categoryLabelMap = categoryOptions.reduce((acc, option) => {
    acc[option.value] = option.label
    return acc
  }, {})

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + (item.amount || 0), 0)

  // Format data with percentages and proper labels
  const formattedData = data.map((item, index) => {
    const categoryValue = item.category || 'other'
    const categoryLabel = categoryLabelMap[categoryValue] || categoryLabelMap['other'] || 'Khác'
    
    return {
      ...item,
      name: categoryLabel,
      value: item.amount || 0,
      percentage: total > 0 ? ((item.amount || 0) / total) * 100 : 0,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }
  })

  // Filter out zero values
  const chartData = formattedData.filter((item) => item.value > 0)
  const hasData = chartData.length > 0

  // Format currency
  const formatCurrency = (value) => {
    return `${Math.round(value).toLocaleString('vi-VN')} ₫`
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null

    const data = payload[0].payload

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '4px',
                backgroundColor: data.color,
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: '13px',
                color: 'text.primary',
              }}
            >
              {data.name}
            </Typography>
          </Box>
          <Box sx={{ pl: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              {formatCurrency(data.value)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '12px',
                color: 'text.secondary',
              }}
            >
              {data.percentage.toFixed(1)}% tổng chi tiêu
            </Typography>
            {data.count && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '11px',
                  color: 'text.secondary',
                  display: 'block',
                  mt: 0.5,
                }}
              >
                {data.count} hóa đơn
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    )
  }

  // Custom label for pie slices
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }) => {
    // Only show label if percentage is > 5%
    if (percent < 0.05) return null

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{
          fontSize: isMobile ? '11px' : '12px',
          fontWeight: 600,
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Custom legend formatter
  const renderLegend = (props) => {
    const { payload } = props

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 1,
          px: 2,
          maxHeight: isMobile ? 120 : 100,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.divider,
            borderRadius: '4px',
          },
        }}
      >
        {payload.map((entry, index) => (
          <Box
            key={`legend-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '3px',
                backgroundColor: entry.color,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontSize: isMobile ? 10 : 11,
                color: 'text.secondary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={entry.value}
            >
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }

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
          <PieChartIcon sx={{ fontSize: 20, color: COLORS.primary }} />
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px', mb: 2 }}>
          Phân bổ chi tiêu theo từng danh mục
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
              Không có dữ liệu
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={isMobile ? 60 : isTablet ? 70 : 80}
                    innerRadius={isMobile ? 35 : isTablet ? 40 : 45}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    {!isMobile && (
                      <Label
                        value={`Tổng: ${formatCurrency(total)}`}
                        position="center"
                        style={{
                          fontSize: isTablet ? 12 : 13,
                          fontWeight: 600,
                          fill: theme.palette.text.primary,
                        }}
                      />
                    )}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    content={renderLegend}
                    verticalAlign="bottom"
                    height={isMobile ? 130 : 110}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default CategorySpendingChart
