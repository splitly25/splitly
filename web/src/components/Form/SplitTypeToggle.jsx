import { Box, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { COLORS } from '~/theme'
import { options } from '~/utils/constants'

const ToggleButton = styled(Button)(({ theme, active }) => ({
  flex: 1,
  fontSize: '14px',
  fontWeight: 500,
  borderRadius: '16px',
  textTransform: 'none',
  padding: '8px 16px',
  height: '36px',
  border: active ? 'none' : `0.8px solid ${theme.palette.divider}`,
  background: active ? COLORS.gradientPrimary : theme.palette.background.default,
  color: active ? '#FAFAFA' : theme.palette.text.primary,
  '&:hover': {
    background: active ? COLORS.gradientPrimary : (theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.palette.background.default),
    opacity: active ? 0.9 : 1,
    border: active ? 'none' : `0.8px solid ${theme.palette.divider}`,
  },
}))

const SplitTypeToggle = ({ value, onChange }) => {
  return (
    <Box sx={{ display: 'flex', gap: '12px', width: '100%' }}>
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          active={value === option.value ? 1 : 0}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </ToggleButton>
      ))}
    </Box>
  )
}

export default SplitTypeToggle
