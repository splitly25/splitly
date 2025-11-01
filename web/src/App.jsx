import Board from "./pages/Boards/_id"
import { Route, Routes, Navigate } from 'react-router-dom'
import NotFound from "./pages/404/NotFound"
import Auth from "./pages/Auth/Auth"

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <Navigate
          to='/boards/abc'
          replace={true}
        />}
      />
      <Route path='/boards/:boardId' element={<Board />} />

      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
