import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
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
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import Avatar from '@mui/material/Avatar'
import Zoom from '@mui/material/Zoom'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { registerUserAPI } from '~/apis'
import { toast } from 'react-toastify'
import { COLORS } from '~/theme'

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const password = watch('password')

  const navigate = useNavigate()
  const onSubmit = async (data) => {
    const { name, email, password } = data
    toast.promise(registerUserAPI({ name, email, password }), {
      pending: 'Registering your account...',
    }).then(user => {
      navigate(`/login?registeredEmail=${user.email}`)
    })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <Zoom in={true} style={{ transitionDelay: '200ms' }}>
      <Card
        sx={{
          minWidth: 380,
          maxWidth: 400,
          width: '100%',
          mx: 2,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: COLORS.primary,
                width: 56,
                height: 56,
                boxShadow: `0 4px 20px ${COLORS.accent}40`,
              }}
            >
              <PersonAddOutlinedIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              fontWeight="bold"
              sx={{ color: COLORS.text, mt: 1 }}
            >
              Sign Up
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: COLORS.textMuted, mt: 0.5 }}
            >
              Create your Splitly account
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              autoComplete="name"
              autoFocus
              error={!!errors.name}
              {...register('name', {
                required: FIELD_REQUIRED_MESSAGE,
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters long.'
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName="name" />

            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              autoComplete="email"
              error={!!errors.email}
              {...register('email', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: EMAIL_RULE,
                  message: EMAIL_RULE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName="email" />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              autoComplete="new-password"
              error={!!errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...register('password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName="password" />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              margin="normal"
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...register('confirmPassword', {
                required: FIELD_REQUIRED_MESSAGE,
                validate: (value) =>
                  value === password || 'Passwords do not match.'
              })}
            />
            <FieldErrorAlert errors={errors} fieldName="confirmPassword" />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                bgcolor: COLORS.primary,
                color: '#fff',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: COLORS.primary,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${COLORS.primary}40`,
                },
                '&:disabled': {
                  opacity: 0.7,
                  transform: 'none',
                },
              }}
              disabled={isSubmitting}
              className='interceptor-loading'
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    textDecoration: 'none',
                    color: COLORS.primary,
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = COLORS.accent
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = COLORS.primary
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  )
}

export default RegisterForm