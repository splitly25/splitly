import { useState } from 'react'
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import {
  Forum as NotificationsActiveIcon,
  Check as CheckCircleIcon
} from '@mui/icons-material'
import PaymentIcon from '~/assets/icons/PaymentIcon'
import Layout from '~/components/Layout'
import { CURRENT_USER_ID, VIEW_TYPES, COLORS } from './constants'
import { formatCurrency } from '~/utils/formatters'
import { useDebt } from '~/hooks/useDebt'

// Action Button Component
const ActionButton = ({ icon: Icon, tooltip, onClick, color }) => (
  <Tooltip title={tooltip}>
    <IconButton size="small" sx={{ color, padding: '4px' }} onClick={onClick}>
      <Icon fontSize="small" />
    </IconButton>
  </Tooltip>
)

// Debt Column Component
const DebtColumn = ({ title, totalAmount, debts, bgColor, textColor, headerBgColor, cardBgColor, cardTextColor, columnType }) => {
  const tableHeaders = columnType === VIEW_TYPES.I_OWE
    ? ['Người bạn nợ', 'Số tiền', 'Thanh toán']
    : ['Người nợ bạn', 'Số tiền', 'Nhắc nhở', 'Xác nhận thanh toán']

  return (
    <Box
      sx={{
        bgcolor: bgColor,
        borderRadius: 3,
        p: 3,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3, flexShrink: 0 }}>
        <Typography variant="h3" fontWeight="700" color={textColor} sx={{ mb: 1 }}>
          {totalAmount < 0 ? '-' : ''}{formatCurrency(Math.abs(totalAmount))}
        </Typography>
        <Typography variant="body1" color={textColor}>
          {title}
        </Typography>
      </Box>

      {/* Table */}
      {debts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color={textColor} sx={{ opacity: 0.7 }}>
            Không có dữ liệu
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 'none',
            flexGrow: 1,
            overflow: 'auto',
            backgroundColor: 'transparent'
          }}
        >
          <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'transparent' }}>
                {tableHeaders.map((header, index) => (
                  <TableCell
                    key={header}
                    align={index === 0 ? 'left' : 'center'}
                    sx={{
                      color: textColor,
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      padding: { xs: '8px 12px', md: '12px 16px' },
                      whiteSpace: 'nowrap',
                      borderBottom: 'none',
                      backgroundColor: 'transparent'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {debts.map((debt, index) => {
                const actions = columnType === VIEW_TYPES.I_OWE 
                  ? [{ icon: PaymentIcon, tooltip: 'Thanh toán', action: 'payment' }]
                  : [
                      { icon: NotificationsActiveIcon, tooltip: 'Nhắc nhở', action: 'remind' },
                      { icon: CheckCircleIcon, tooltip: 'Xác nhận thanh toán', action: 'confirm' }
                    ]

                return (
                  <TableRow
                    key={debt.userId}
                    sx={{
                      backgroundColor: cardBgColor,
                      borderRadius: '16px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden',
                      '&:hover': {
                        opacity: 0.9,
                        transition: 'all 0.2s'
                      },
                      '& td:first-of-type': {
                        borderTopLeftRadius: '16px',
                        borderBottomLeftRadius: '16px'
                      },
                      '& td:last-of-type': {
                        borderTopRightRadius: '16px',
                        borderBottomRightRadius: '16px'
                      }
                    }}
                  >
                    <TableCell
                      align="left"
                      sx={{
                        color: cardTextColor,
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        padding: { xs: '8px 12px', md: '12px 16px' },
                        border: 'none'
                      }}
                    >
                      {debt.userName}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: cardTextColor,
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                        padding: { xs: '8px 12px', md: '12px 16px' },
                        border: 'none'
                      }}
                    >
                      {formatCurrency(debt.totalAmount)}
                    </TableCell>
                    {actions.map(({ icon, tooltip, action }, idx) => (
                      <TableCell
                        key={action}
                        align="center"
                        sx={{
                          padding: { xs: '8px 12px', md: '12px 16px' },
                          border: 'none'
                        }}
                      >
                        <ActionButton
                          icon={icon}
                          tooltip={tooltip}
                          color={cardTextColor}
                          onClick={() => console.log(`${action} clicked for`, debt.userName)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

// Main Debt Component
const Debt = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [activeView, setActiveView] = useState(VIEW_TYPES.OWED_TO_ME)
  const { loading, error, debtData } = useDebt(CURRENT_USER_ID)

  const handleViewChange = (event, newView) => {
    if (newView) setActiveView(newView)
  }

  const renderColumn = (type) => {
    const isIOwe = type === VIEW_TYPES.I_OWE
    const config = isIOwe ? COLORS.iOwe : COLORS.owedToMe
    const data = isIOwe ? debtData.iOwe : debtData.owedToMe
    
    return (
      <DebtColumn
        title={isIOwe ? 'là số tiền bạn còn nợ' : 'là số tiền bạn chưa thu hồi'}
        totalAmount={isIOwe ? -data.total : data.total}
        debts={data.debts}
        bgColor={config.bg}
        textColor={config.text}
        headerBgColor={config.headerBg}
        cardBgColor={config.cardBg}
        cardTextColor={config.cardText}
        columnType={type}
      />
    )
  }

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="w-full h-screen overflow-hidden flex flex-col py-8 px-4 md:px-8">
        {/* Mobile Toggle */}
        {isMobile && (
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={activeView}
              exclusive
              onChange={handleViewChange}
              fullWidth
              sx={{ maxWidth: '500px' }}
            >
              <ToggleButton
                value={VIEW_TYPES.OWED_TO_ME}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: '#574D98',
                    color: 'white',
                    '&:hover': { bgcolor: '#4a4080' }
                  }
                }}
              >
                Bạn chưa thu hồi
              </ToggleButton>
              <ToggleButton
                value={VIEW_TYPES.I_OWE}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: '#fee2e2',
                    color: '#574D98',
                    '&:hover': { bgcolor: '#fecaca' }
                  }
                }}
              >
                Bạn còn nợ
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {/* Content */}
        {!isMobile ? (
          <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
            <div className="h-full overflow-hidden">{renderColumn(VIEW_TYPES.I_OWE)}</div>
            <div className="h-full overflow-hidden">{renderColumn(VIEW_TYPES.OWED_TO_ME)}</div>
          </div>
        ) : (
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            {renderColumn(activeView)}
          </Box>
        )}
      </div>
    </Layout>
  )
}

export default Debt
