import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Box from '@mui/material/Box'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { captializeFirstLetter } from '~/utils/formatter'

const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  px: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': { color: 'white' },
  '&:hover': { bgcolor: 'primary.50' },
}

function BoardBar({ board }) {
  return (
    <Box sx={(theme) => ({
      width: '100%',
      height: theme.trello.boardBarHeight,
      display: 'flex',
      px: 2,
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      borderBottom: '1px solid white',
      bgcolor: '#1976d2',
      ...theme.applyStyles('dark', {
        bgcolor: '#30495e'
      }),
      '&::-webkit-scrollbar-track': { m: 2 },
    })}>

      {/* Left side content */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLE}
          icon={<DashboardIcon />}
          label={board?.title}
          // clickable
          onClick={() => { }}

        />
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label={captializeFirstLetter(board?.type)}
          // clickable
          onClick={() => { }}

        />
        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          // clickable
          onClick={() => { }}

        />
        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automation"
          // clickable
          onClick={() => { }}
        />
        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label="Filter"
          // clickable
          onClick={() => { }}
        />
      </Box>

      {/* Right side content */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            gap: '8px',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              fontSize: 15,
              // border: 'none'
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: ' #a4b0be' }
            }
          }}
        >
          <Tooltip title="khang">
            <Avatar
              alt="khang"
              src="https://i.pravatar.cc/218"
            />
          </Tooltip>
          <Tooltip title="khang">
            <Avatar
              alt="khang"
              src="https://i.pravatar.cc/211"
            />
          </Tooltip>
          <Tooltip title="khang">
            <Avatar
              alt="khang"
              src="https://i.pravatar.cc/216"
            />
          </Tooltip>
          <Tooltip title="khang">
            <Avatar
              alt="khang"
              src="https://i.pravatar.cc/118"
            />
          </Tooltip>

        </AvatarGroup>
      </Box>

    </Box>
  )
}

export default BoardBar