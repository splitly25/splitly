import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Zoom from '@mui/material/Zoom'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import GoogleIcon from '@mui/icons-material/Google'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE,
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { loginUserAPI } from '~/redux/user/userSlice'
function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const onSubmit = async (data) => {
    const { email, password } = data
    toast
      .promise(dispatch(loginUserAPI({ email, password })), {
        pending: 'Logging in...',
      })
      .then((response) => {
        if (!response.error) navigate('/dashboard')
      })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Zoom in={true} style={{ transitionDelay: '200ms' }}>
      <Card
        sx={{
          minWidth: 300,
          maxWidth: 450,
          width: '100%',
          mx: 2,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                m: 1,
                background: 'linear-gradient(135deg, #EF9A9A 0%, #E57373 100%)',
                width: 56,
                height: 56,
                boxShadow: '0 10px 30px -10px rgba(244, 63, 94, 0.4)',
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 28, color: '#fff' }} />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              fontWeight="bold"
              color="text.primary"
              sx={{ mt: 1 }}
            >
              Sign In
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Welcome back to Splitly
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {registeredEmail && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Registration successful! A verification email has been sent to <strong>{registeredEmail}</strong>.
                Please check your inbox to verify your account.
              </Alert>
            )}

            {verifiedEmail && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Your account has been verified successfully! You can now sign in with your email{' '}
                <strong>{verifiedEmail}</strong>.
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              {...register('email', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: EMAIL_RULE,
                  message: EMAIL_RULE_MESSAGE,
                },
              })}
            />
            <FieldErrorAlert errors={errors} fieldName="email" />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              autoComplete="current-password"
              error={!!errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE,
                },
              })}
            />
            <FieldErrorAlert errors={errors} fieldName="password" />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #EF9A9A 0%, #E57373 100%)',
                borderRadius: '12px',
                boxShadow: '0 10px 30px -10px rgba(244, 63, 94, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 35px -10px rgba(244, 63, 94, 0.5)',
                  background: 'linear-gradient(135deg, #E57373 0%, #EF5350 100%)',
                },
                '&:disabled': {
                  opacity: 0.7,
                  transform: 'none',
                },
              }}
              disabled={isSubmitting}
              className="interceptor-loading"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            {/* <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.5,
                fontWeight: 500,
                fontSize: '1rem',
                borderColor: 'divider',
                color: 'text.primary',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(239, 154, 154, 0.04)',
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => {
                // TODO: Implement Google login
                console.log('Google login - to be implemented')
              }}
            >
              Continue with Google
            </Button> */}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.primary">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    textDecoration: 'none',
                    color: '#E57373',
                    fontWeight: '600',
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  )
}

export default LoginForm
