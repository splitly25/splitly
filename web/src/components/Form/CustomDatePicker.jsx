import { useRef } from 'react'
import { Box, Typography, Button } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

const CustomDatePicker = ({ label, required, value, onChange, placeholder = 'Chọn ngày' }) => {
  const inputRef = useRef(null)

  const formatDate = (date) => {
    if (!date) return placeholder
    try {
      const d = new Date(date)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      return `${day}/${month}/${year}`
    } catch {
      return placeholder
    }
  }

  const handleButtonClick = () => {
    if (inputRef.current) {
      try {
        // Try using showPicker() first (modern browsers)
        if (typeof inputRef.current.showPicker === 'function') {
          inputRef.current.showPicker()
        } else {
          // Fallback: trigger click and focus
          inputRef.current.focus()
          inputRef.current.click()
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // If showPicker fails, use click as fallback
        console.log('showPicker not supported, using click fallback')
        inputRef.current.focus()
        inputRef.current.click()
      }
    }
  }

  const handleDateChange = (e) => {
    const selectedDate = e.target.value
    if (selectedDate && onChange) {
      // Return ISO string for consistency
      onChange(new Date(selectedDate).toISOString())
    }
  }

  // Get the date value for the input
  const getInputValue = () => {
    if (!value) return ''
    try {
      return new Date(value).toISOString().split('T')[0]
    } catch {
      return ''
    }
  }

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'text.primary',
          mb: 0,
        }}
      >
        {required ? `${label} *` : label}
      </Typography>
      <Button
        sx={(theme) => ({
          marginTop: '8px',
          fontSize: '14px',
          borderRadius: '16px',
          backgroundColor: theme.palette.background.default,
          border: `0.8px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          textTransform: 'none',
          justifyContent: 'flex-start',
          padding: '8px 12px',
          fontWeight: 500,
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.default,
            border: `0.8px solid ${theme.palette.divider}`,
          },
        })}
        fullWidth
        startIcon={<CalendarTodayIcon sx={{ width: '16px', height: '16px' }} />}
        onClick={handleButtonClick}
      >
        {formatDate(value)}
      </Button>
      {/* Hidden native date input */}
      <input
        ref={inputRef}
        type="date"
        value={getInputValue()}
        onChange={handleDateChange}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
          zIndex: -1,
        }}
      />
    </Box>
  )
}

export default CustomDatePicker
