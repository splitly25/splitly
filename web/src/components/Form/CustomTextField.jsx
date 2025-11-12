import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useAutoCalculate } from '~/hooks/useAutoCaculate'

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    fontSize: '14px',
    fontWeight: 500,
    color: theme.palette.text.primary,
    marginBottom: '8px',
    position: 'static',
    transform: 'none',
    '&.Mui-focused': {
      color: theme.palette.text.primary,
    },
  },
  '& .MuiOutlinedInput-root': {
    marginTop: '8px',
    fontSize: '14px',
    borderRadius: '16px',
    backgroundColor: theme.palette.background.default,
    '& fieldset': {
      borderColor: theme.palette.divider,
      borderWidth: '0.8px',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.divider,
      borderWidth: '0.8px',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: '0.8px',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 12px',
    fontSize: '14px',
    color: theme.palette.text.primary,
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
  },
}))

const CustomTextField = ({ label, required, enableAutoCalculate, onChange, onBlur, value, ...props }) => {
  // Use the auto-calculate hook
  const autoCalculate = useAutoCalculate(value, (result) => {
    if (onChange) {
      // Create synthetic event with calculated value
      const syntheticEvent = {
        target: { value: result.toString() },
      }
      onChange(syntheticEvent)
    }
  })

  const handleBlur = (e) => {
    // If auto-calculate is enabled, use the hook's handler
    if (enableAutoCalculate) {
      autoCalculate.handleBlur(e)
    }

    // Call original onBlur if provided
    if (onBlur) {
      onBlur(e)
    }
  }

  return (
    <StyledTextField
      label={required ? `${label} *` : label}
      InputLabelProps={{ shrink: true }}
      fullWidth
      value={value}
      onChange={onChange}
      onBlur={handleBlur}
      {...props}
    />
  )
}

export default CustomTextField
