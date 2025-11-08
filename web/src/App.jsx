import Board from './pages/Boards/_id'
import { Route, Routes, Navigate } from 'react-router-dom'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'
import History from './pages/History'
import Debt from './pages/Debt'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/user/userSlice'
import AccountVerification from './pages/Auth/AccountVerification'

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace={true} />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/history" element={<History />} />
      <Route path="/debt" element={<Debt />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path="/boards/:boardId" element={<Board />} />
      </Route>

      {/* AuthenticationRoutes */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      <Route path="/account/verification" element={<AccountVerification />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
