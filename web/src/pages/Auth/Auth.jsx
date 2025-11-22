import { Navigate, useLocation, Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Aurora from '~/pages/Landing/components/Aurora'

function Auth() {
  const location = useLocation()

  const isLogin = location.pathname === '/login' || location.pathname === '/login/'
  const isRegister = location.pathname === '/register' || location.pathname === '/register/'

  const currentUser = useSelector(selectCurrentUser)
  if (currentUser) {
    return <Navigate to="/dashboard" replace={true} />
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FFF5F5',
      }}
    >
      {/* Aurora Background - Light Pink Theme */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <Aurora
          colorStops={["#F8BBD0", "#EF9A9A", "#E57373"]}
          amplitude={1.0}
          blend={0.5}
          speed={0.6}
        />
      </Box>

      {/* Logo - Back to Landing */}
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1e293b',
            }}
          >
            Split<span style={{ color: '#EF9A9A' }}>ly</span>
          </span>
        </Link>
      </Box>

      {/* Form Container */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {isLogin && <LoginForm />}
        {isRegister && <RegisterForm />}
      </Box>
    </Box>
  )
}

export default Auth
