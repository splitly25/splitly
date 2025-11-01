
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Started from './Menus/Started'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profile from './Menus/Profile'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import ModeSelect from '../ModeSelect/ModeSelect'

function AppBar() {
  const [searchText, setSearchText] = useState('')

  return (
    <Box sx={(theme) => ({
      width: '100%',
      height: theme.app.appBarHeight,
      display: 'flex',
      px: 2,
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: '#1565c0',
      ...theme.applyStyles('dark', {
        bgcolor: '#2c3e50'
      }),
      '&::-webkit-scrollbar-track': { m: 2 },
    })}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
          <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}> Bill Sharing</Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Started />
          <Templates />
          <Button
            sx={{
              color: 'white',
              borderColor: 'none',
              '&:hover': { borderColor: 'none' }
            }}
            variant="outlined"
            startIcon={<LibraryAddIcon />}>
            Create
          </Button>
        </Box>

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          id="outlined-search"
          label="Search field"
          type="text"
          size='small'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: 'white ' }} />
              </InputAdornment>),
            endAdornment: (
              <InputAdornment position='end'>
                <CloseIcon
                  sx={{
                    color: `${searchText ? 'white' : 'transparent'}`,
                    fontSize: 'small',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSearchText('')}
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '190px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
            }
          }}
        />
        <ModeSelect />
        <Tooltip title="Notification">
          <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }} >
            <NotificationsNoneIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
        <Tooltip title='Help'>
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>
        <Profile />
      </Box>

    </Box>
  )
}

export default AppBar