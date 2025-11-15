import { TextField } from '@mui/material'
import { useAutoCalculate } from '~/hooks/useAutoCaculate'
import { removeLeadingZeros } from '~/utils/formatters'

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

  const handleChange = (e) => {
    let newValue = e.target.value

    // Only apply removeLeadingZeros for number-like inputs
    if (enableAutoCalculate || props.type === 'number' || props.type === 'text') {
      if (/^[\d+\-*/().\s]*$/.test(newValue)) {
        newValue = removeLeadingZeros(newValue)
      }
    }
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: newValue,
      },
    }
    if (onChange) onChange(newEvent)
  }

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
    <TextField
      sx={(theme) => ({
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
      })}
      label={required ? `${label} *` : label}
      InputLabelProps={{ shrink: true }}
      slotProps={{
        input: {
          notched: false,
          ...props.InputProps,
        },
      }}
      fullWidth
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  )
}

export default CustomTextField
