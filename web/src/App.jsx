import Board from './pages/Boards/_id'
import { Route, Routes, Navigate } from 'react-router-dom'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/user/userSlice'
import { Outlet } from 'react-router-dom'
import Debt from './pages/Debt'
import AccountVerification from './pages/Auth/AccountVerification'
import PaymentConfirmation from './pages/PaymentConfirmation/PaymentConfirmation'
import { Ocr, Bills } from "./pages/Bills"
import BillDetail from './pages/Bills/BillDetail'
import Group from './pages/Groups/Group'
import Payment from './pages/Payment/Payment'
import PaymentSuccess from './pages/Payment/PaymentSuccess'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<Group />} />
        {/* <Route path="/groups/:groupId" element={<GroupDetail />} /> */}
        <Route path="/history" element={<History />} />
        <Route path="/debt" element={<Debt />} />
        <Route path="/boards/:boardId" element={<Board />} />
        <Route path="/create" element={<Bills />} />
        <Route path="/ocr" element={<Ocr />} />
        <Route path="/bills/:billId" element={<BillDetail />} />
      </Route>

      {/* Authentication Routes */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />
      
      {/* Public Routes (no authentication required) */}
      <Route path="/payment/confirm" element={<PaymentConfirmation />} />
      <Route path="/payment/pay" element={<Payment />} />
      <Route path="/payment/pay/success" element={<PaymentSuccess />} />
      
      {/* Default and Not Found Routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace={true} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
