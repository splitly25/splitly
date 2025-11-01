import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
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
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const password = watch('password')

  const onSubmit = async (data) => {
    // Handle registration logic here
    //  console.log('Register data:', data)

  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <Zoom in={true} style={{ transitionDelay: '200ms' }}>
      <Card sx={{ minWidth: 380, maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <PersonAddOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" fontWeight="bold">
              Sign Up
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
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