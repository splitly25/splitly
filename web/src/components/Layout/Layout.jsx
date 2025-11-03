import { Box, Drawer, IconButton, Avatar, Tooltip } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import GroupsIcon from '@mui/icons-material/Groups'
import HistoryIcon from '@mui/icons-material/History'
import DescriptionIcon from '@mui/icons-material/Description'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate, useLocation } from 'react-router-dom'
import colors from 'tailwindcss/colors'

const SIDEBAR_WIDTH = 80

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { icon: <AddIcon />, path: '/create', label: 'Create', color: colors.purple[200] },
    { icon: <HomeIcon />, path: '/dashboard', label: 'Home' },
    { icon: <GroupsIcon />, path: '/groups', label: 'Groups' },
    { icon: <HistoryIcon />, path: '/history', label: 'History' },
    { icon: <DescriptionIcon />, path: '/bills', label: 'Bills' },
  ]

  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: colors.red[50],
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 3,
            px: 1.5,
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 4, mt: 1 }}>
          <img
            src="/Splitly.svg"
            alt="Splitly"
            style={{ width: '50px', height: '50px', cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          />
        </Box>

        {/* Menu Items */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {menuItems.map((item, index) => {
            const isActive = isActivePath(item.path)
            return (
              <Tooltip key={index} title={item.label} placement="right">
                <IconButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: item.color || (isActive ? colors.purple[800] : 'transparent'),
                    color: item.color ? colors.purple[800] : (isActive ? 'white' : colors.purple[800]),
                    '&:hover': {
                      backgroundColor: item.color || (isActive ? colors.purple[700] : colors.purple[100]),
                      color: item.color ? colors.purple[800] : (isActive ? 'white' : colors.purple[800]),
                    },
                    borderRadius: item.color ? '45px' : '12px',
                    boxShadow: item.color ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            )
          })}
        </Box>

        {/* User Profile */}
        <Box sx={{ mt: 'auto' }}>
          <Tooltip title="Profile" placement="right">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: '#B0B0B0',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              {/* Shortname of user */}
              GT
            </Avatar>
          </Tooltip>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#FFFFFF',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Layout
