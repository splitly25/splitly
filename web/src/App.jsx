import Board from "./pages/Boards/_id"
import { Route, Routes, Navigate } from 'react-router-dom'
import NotFound from "./pages/404/NotFound"
import Auth from "./pages/Auth/Auth"
import Dashboard from "./pages/Dashboard"
import Groups from "./pages/Groups"
import History from "./pages/History"
import Bills from "./pages/Bills"

function App() {
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
      <Route path='/bills' element={<Bills />} />

      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
