import styled from '@emotion/styled'
import { Avatar, Box, Button, Chip, Typography } from '@mui/material'
import { COLORS } from '~/theme'
import { getInitials } from '~/utils/formatters'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const PersonRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '4px',
  minHeight: '72px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
  },
  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
    gap: '8px',
    minHeight: 'auto',
  },
}))

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
  backgroundColor: theme.palette.primary.main,
  fontSize: '12px',
  fontWeight: 400,
  color: theme.palette.primary.contrastText,
}))

const AddButton = styled(Button)(() => ({
  background: COLORS.gradientPrimary,
  color: '#FFFFFF',
  borderRadius: '99px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 600,
  padding: '6px 24px',
  height: '37px',
  minWidth: '78px',
  '&:hover': {
    background: COLORS.gradientPrimary,
    opacity: 0.9,
  },
}))

function PeopleProfileToAdd({ person, handleTogglePerson }) {
  const isGuest = person.userType === 'guest' || person.isTemporary

  // console.log('Rendering PeopleProfileToAdd for person:', person)

  return (
    <PersonRow key={person.id}>
      <UserAvatar
        sx={{
          width: 32,
          height: 32,
          fontSize: '16px',
          backgroundColor: isGuest ? 'grey.400' : 'primary.main'
        }}
      >
        {isGuest ? <PersonAddIcon sx={{ fontSize: '16px' }} /> : getInitials(person.name)}
      </UserAvatar>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: '16px', color: 'text.primary', fontWeight: 400 }}>
          {person.name}
        </Typography>
        <Typography sx={{ fontSize: '14px', color: 'text.secondary', fontWeight: 400 }}>
          {person.email}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {(isGuest || person.isGuest) && (
          <Chip
            label="Guest"
            size="small"
            sx={{
              height: '24px',
              fontSize: '11px',
              backgroundColor: 'grey.300',
              color: 'text.secondary',
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        )}
        <AddButton onClick={() => handleTogglePerson(person)}>Add</AddButton>
      </Box>
    </PersonRow>
  )
}

export default PeopleProfileToAdd
