import { Navigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import backgroundImage from '~/assets/background.jpg'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { COLORS } from '~/theme'

function Auth() {
  const location = useLocation()

  const isLogin = location.pathname === '/login' || location.pathname === '/login/'
  const isRegister = location.pathname === '/register' || location.pathname === '/register/'

  const currentUser = useSelector(selectCurrentUser)
  if (currentUser) {
    return <Navigate to="/" replace={true} />
  }


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${COLORS.primary}15 0%, ${COLORS.accent}10 100%)`,
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {isLogin && <LoginForm />}
        {isRegister && <RegisterForm />}
      </Box>
    </Box>
  )
}

export default Auth
