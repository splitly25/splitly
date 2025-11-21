import { TextField, Chip, Popover, Box, Typography } from '@mui/material'
import { useState } from 'react'
import { useAutoCalculate } from '~/hooks/useAutoCaculate'
import { removeLeadingZeros } from '~/utils/formatters'

const CustomTextField = ({ label, required, enableAutoCalculate, onChange, onBlur, value, ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null)

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

  const handleSmartClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

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

  // Smart badge as end adornment - hide when user is typing
  const smartBadge = enableAutoCalculate && !value ? (
    <Chip
      label="⚡ Smart"
      size="small"
      onClick={handleSmartClick}
      sx={{
        height: '20px',
        fontSize: '9px',
        fontWeight: 600,
        backgroundColor: 'primary.main',
        color: 'white',
        cursor: 'pointer',
        '& .MuiChip-label': {
          padding: '0 6px',
        },
        '&:hover': {
          opacity: 0.9,
        },
      }}
    />
  ) : null

  return (
    <>
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
            endAdornment: smartBadge,
            ...props.InputProps,
          },
        }}
        fullWidth
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, maxWidth: 280 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: '14px' }}>
            ⚡ Smart Input
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '13px', mb: 1.5, color: 'text.secondary' }}>
            Hỗ trợ tự động tính toán:
          </Typography>
          <Box component="ul" sx={{ mt: 0, pl: 2.5, mb: 0, '& li': { fontSize: '12px', mb: 0.5, color: 'text.primary' } }}>
            <li>Phép tính: 100+200 → 300</li>
            <li>Nghìn đồng: 65k → 65000</li>
            <li>Kết hợp: 50k+15k → 65000</li>
          </Box>
        </Box>
      </Popover>
    </>
  )
}

export default CustomTextField
