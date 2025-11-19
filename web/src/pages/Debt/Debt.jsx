import { useState } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip
} from '@mui/material'
import {
  Send as SendIcon,
  NotificationsActive as NotificationsActiveIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Layout from '~/components/Layout'
import { formatCurrency } from '~/utils/formatters'
import { useDebt } from '~/hooks/useDebt'
import PaymentDialog from './PaymentDialog'
import ConfirmPaymentDialog from './ConfirmPaymentDialog'
import RemindDialog from './RemindDialog'

// Summary Card Component
const SummaryCard = ({ title, amount, icon: Icon, bgColor, textColor, iconBgColor, cardBgColor }) => (
  <Card
    sx={{
      border: '1px solid',
      borderColor: bgColor,
      borderRadius: '20px',
      boxShadow: 'none',
      height: '100%',
      bgcolor: cardBgColor,
      '&:hover': {
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s'
      }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '14px' }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" sx={{ color: textColor, fontSize: '30px' }}>
            {formatCurrency(amount)}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon sx={{ fontSize: 32, color: textColor }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
)

// Person Debt Card Component
const PersonDebtCard = ({ person, type, onPaymentClick, onRemindClick, onConfirmPayment }) => {
  const isIOwe = type === 'iOwe'
  const bgColor = isIOwe ? 'rgba(255, 214, 167, 0.3)' : 'rgba(185, 248, 207, 0.3)'
  const amountColor = isIOwe ? '#ca3500' : '#008236'

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    <Card
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '20px',
        boxShadow: 'none',
        bgcolor: bgColor,
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.3s'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #ef9a9a 0%, #ce93d8 100%)',
              fontSize: '18px',
              fontWeight: 500
            }}
          >
            {getInitials(person.userName)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 0.5, fontSize: '24px' }}>
              {person.userName}
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color: amountColor, mb: 2, fontSize: '24px' }}>
              {formatCurrency(person.totalAmount)}
            </Typography>
            
            {/* Bill items */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {person.bills?.map((bill, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                    {bill.billName}
                  </Typography>
                  <Chip
                    label={formatCurrency(bill.remainingAmount || bill.amountOwed)}
                    size="small"
                    sx={{
                      bgcolor: 'white',
                      border: '1px solid',
                      borderColor: 'divider',
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  />
                </Box>
              ))}
            </Box>

            {/* Action buttons */}
            {isIOwe ? (
              <Button
                fullWidth
                variant="contained"
                startIcon={<SendIcon />}
                onClick={() => onPaymentClick(person)}
                sx={{
                  background: 'linear-gradient(90deg, #ff6900 0%, #f54900 100%)',
                  color: 'white',
                  borderRadius: '18px',
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  py: 1,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #f54900 0%, #e03d00 100%)',
                  }
                }}
              >
                Thanh toán
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<NotificationsActiveIcon />}
                  onClick={() => onRemindClick(person)}
                  sx={{
                    borderColor: 'divider',
                    color: 'text.primary',
                    borderRadius: '18px',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    py: 1,
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'rgba(0,0,0,0.02)'
                    }
                  }}
                >
                  Nhắc nhở
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => onConfirmPayment(person)}
                  sx={{
                    background: 'linear-gradient(90deg, #00c950 0%, #00a63e 100%)',
                    color: 'white',
                    borderRadius: '18px',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    py: 1,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #00a63e 0%, #008e34 100%)',
                    }
                  }}
                >
                  Đã thanh toán
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

// Main Debt Component
const Debt = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedCreditor, setSelectedCreditor] = useState(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedDebtor, setSelectedDebtor] = useState(null)
  const [remindDialogOpen, setRemindDialogOpen] = useState(false)
  const [selectedRemindDebtor, setSelectedRemindDebtor] = useState(null)
  
  // Get current user from Redux store
  const currentUser = useSelector(selectCurrentUser)
  const currentUserId = currentUser?._id
  
  const { loading, error, debtData, refetch } = useDebt(currentUserId)

  const handlePaymentClick = (creditor) => {
    setSelectedCreditor(creditor)
    setPaymentDialogOpen(true)
  }

  const handleRemindClick = (debtor) => {
    setSelectedRemindDebtor(debtor)
    setRemindDialogOpen(true)
  }

  const handleConfirmPayment = (debtor) => {
    setSelectedDebtor(debtor)
    setConfirmDialogOpen(true)
  }

  if (!currentUserId) {
    return (
      <Layout>
        <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Alert severity="error">User not authenticated</Alert>
        </Box>
      </Layout>
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
      <Box
        className="bg-gray-50"
        sx={{ p: { xs: 2, sm: 3, md: 4 }, height: '100%', overflow: 'auto', backgroundColor: '#F9FAFB' }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5, fontFamily: "'Nunito Sans', sans-serif" }}>
            Sổ tay nợ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Theo dõi công nợ với bạn bè
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            mb: 3
          }}
        >
          <SummaryCard
            title="Tổng mình nợ"
            amount={debtData.iOwe.total}
            icon={TrendingDownIcon}
            bgColor="#ffd6a7"
            textColor="#ca3500"
            iconBgColor="#ffd6a8"
            cardBgColor="rgba(255, 214, 167, 0.2)"
          />
          <SummaryCard
            title="Tổng người khác nợ"
            amount={debtData.owedToMe.total}
            icon={TrendingUpIcon}
            bgColor="#b9f8cf"
            textColor="#008236"
            iconBgColor="#b9f8cf"
            cardBgColor="rgba(185, 248, 207, 0.2)"
          />
        </Box>

        {/* Debt Lists */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            alignItems: 'start'
          }}
        >
          {/* I Owe Section */}
          <Box>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2, fontFamily: "'Nunito Sans', sans-serif" }}>
              Mình nợ người khác
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {debtData.iOwe.debts.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: '20px' }}>
                  <Typography color="text.secondary">Không có dữ liệu</Typography>
                </Card>
              ) : (
                debtData.iOwe.debts.map((person) => (
                  <PersonDebtCard
                    key={person.userId}
                    person={person}
                    type="iOwe"
                    onPaymentClick={handlePaymentClick}
                  />
                ))
              )}
            </Box>
          </Box>

          {/* Owed To Me Section */}
          <Box>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 2, fontFamily: "'Nunito Sans', sans-serif" }}>
              Người khác nợ mình
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {debtData.owedToMe.debts.length === 0 ? (
                <Card sx={{ p: 3, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: '20px' }}>
                  <Typography color="text.secondary">Không có dữ liệu</Typography>
                </Card>
              ) : (
                debtData.owedToMe.debts.map((person) => (
                  <PersonDebtCard
                    key={person.userId}
                    person={person}
                    type="owedToMe"
                    onRemindClick={handleRemindClick}
                    onConfirmPayment={handleConfirmPayment}
                  />
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        creditor={selectedCreditor}
      />

      {/* Confirm Payment Dialog */}
      <ConfirmPaymentDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        myId={currentUserId}
        debtor={selectedDebtor}
        defaultAmount={selectedDebtor?.totalAmount}
        bills={selectedDebtor?.bills || []}
        refetch={refetch}
      />

      {/* Remind Dialog */}
      <RemindDialog
        open={remindDialogOpen}
        onClose={() => setRemindDialogOpen(false)}
        debtor={selectedRemindDebtor}
        creditorId={currentUserId}
      />
    </Layout>
  )
}

export default Debt
