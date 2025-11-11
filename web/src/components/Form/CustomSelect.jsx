import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

const StyledSelect = styled(Select)(({ theme }) => ({
  marginTop: '8px',
  fontSize: '14px',
  borderRadius: '16px',
  backgroundColor: theme.palette.background.default,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
    borderWidth: '0.8px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
    borderWidth: '0.8px',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
    borderWidth: '0.8px',
  },
  '& .MuiSelect-select': {
    padding: '8px 12px',
    fontSize: '14px',
    color: theme.palette.text.primary,
  },
}))

const CustomSelect = ({ label, required, options = [], value, onChange, ...props }) => {
  return (
    <FormControl
      fullWidth
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
      })}
    >
      <InputLabel shrink>{required ? `${label} *` : label}</InputLabel>
      <StyledSelect value={value} onChange={onChange} IconComponent={KeyboardArrowDownIcon} {...props}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  )
}

export default CustomSelect
