import Board from "./pages/Boards/_id"
import { Route, Routes, Navigate } from 'react-router-dom'
import NotFound from "./pages/404/NotFound"
import Auth from "./pages/Auth/Auth"
import Dashboard from "./pages/Dashboard"
import Groups from "./pages/Groups"
import History from "./pages/History"
import Bills from "./pages/Bills"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "./store/authSlice"
import { Outlet } from "react-router-dom"

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      <Route path='/' element={
        <Navigate
          to='/dashboard'
          replace={true}
        />}
      />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/groups' element={<Groups />} />
      <Route path='/history' element={<History />} />
      {/* <Route path='/bills' element={<Bills />} /> */}
      
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path='/bills' element={<Bills />} />
      </Route>

      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
