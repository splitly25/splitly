import { Box, Drawer, IconButton, Avatar, Tooltip, AppBar, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import GroupsIcon from '@mui/icons-material/Groups'
import HistoryIcon from '@mui/icons-material/History'
import DescriptionIcon from '@mui/icons-material/Description'
import AddIcon from '@mui/icons-material/Add'
import MenuIcon from '@mui/icons-material/Menu'
import { useNavigate, useLocation } from 'react-router-dom'
import colors from 'tailwindcss/colors'
import { useState } from 'react'
import ChatbotButton from '~/components/Chatbot/ChatbotButton'
import ChatbotWindow from '../Chatbot/ChatbotWindow'

const SIDEBAR_WIDTH = 80

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallScreen = useMediaQuery('(min-width: 900px) and (max-width: 1240px)')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Chatbot handler
  const [chatbotWindowOpen, setChatbotWindowOpen] = useState(false)
  const [numberOfNotifications, setNumberOfNotifications] = useState(2)
  const [newMessage, setNewMessage] = useState("You have a new message from TingTing Bot!")
  
  // Dynamic chatbot width based on screen size
  const chatbotWidth = isMobile ? '100vw' : isSmallScreen ? '45vw' : '30vw'

  const menuItems = [
    { icon: <AddIcon />, path: '/create', label: 'Create', color: colors.purple[200] },
    { icon: <HomeIcon />, path: '/dashboard', label: 'Home' },
    { icon: <GroupsIcon />, path: '/groups', label: 'Groups' },
    { icon: <HistoryIcon />, path: '/history', label: 'History' },
    { icon: <DescriptionIcon />, path: '/debt', label: 'Debt' },
  ]

  const isActivePath = (path) => {
    return location.pathname === path
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavigate = (path) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 3,
        px: 1.5,
        backgroundColor: colors.red[50],
      }}
    >
      {/* Logo */}
      <Box sx={{ mb: 4, mt: 1 }}>
        <img
          src="/Splitly.svg"
          alt="Splitly"
          style={{ width: '50px', height: '50px', cursor: 'pointer' }}
          onClick={() => handleNavigate('/dashboard')}
        />
      </Box>

      {/* Menu Items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = isActivePath(item.path)
          return (
            <Tooltip key={index} title={item.label} placement="right">
              <IconButton
                onClick={() => handleNavigate(item.path)}
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
            PH
          </Avatar>
        </Tooltip>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            borderBottom: 'none',
          }}
        >
          <Toolbar sx={{ minHeight: '56px !important', padding: '0 !important' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                color: colors.purple[800],
                backgroundColor: colors.red[50],
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                ml: 2,
                mt: 2,
                '&:hover': {
                  backgroundColor: colors.red[50],
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar - Desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Sidebar - Mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: '#FFFFFF',
          overflow: 'auto',
          marginTop: isMobile ? '56px' : 0,
          transition: 'margin-right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          marginRight: !isMobile && chatbotWindowOpen ? chatbotWidth : '0',
        }}
      >
        {children}
      </Box>

      {/* Chatbot Button */}
      <ChatbotButton 
        isOpen={chatbotWindowOpen} 
        setIsOpen={setChatbotWindowOpen} 
        numberOfNotifications={numberOfNotifications}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
      />

      {/* Chatbot Window */}
      <Box
        sx={{ 
          position: 'fixed',
          right: isMobile ? 0 : 0,
          top: isMobile ? 'auto' : 0,
          bottom: isMobile ? 0 : 'auto',
          left: isMobile ? 0 : 'auto',
          height: isMobile ? '70vh' : '100vh',
          width: chatbotWidth,
          transform: chatbotWindowOpen 
            ? 'translate(0, 0)' 
            : isMobile 
              ? 'translateY(100%)' 
              : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1199,
          borderTopLeftRadius: isMobile ? '20px' : 0,
          borderTopRightRadius: isMobile ? '20px' : 0,
          overflow: 'hidden',
        }}
      >
        <ChatbotWindow isOpen={chatbotWindowOpen} setIsOpen={setChatbotWindowOpen}/>
      </Box>
    </Box>
  )
}

export default Layout
