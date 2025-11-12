import {
  Box,
  Drawer,
  IconButton,
  Avatar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material'
import {
  Home as HomeIcon,
  Description as DescriptionIcon,
  MenuBook as MenuBookIcon,
  Groups as GroupsIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  SettingsBrightness as SettingsBrightnessIcon,
  Edit as EditIcon,
  CameraAlt as CameraAltIcon,
  Chat as ChatIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import ChatbotButton from '~/components/Chatbot/ChatbotButton'
import ChatbotWindow from '../Chatbot/ChatbotWindow'
import { useDispatch } from 'react-redux'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { useColorScheme } from '@mui/material/styles'
import { COLORS } from '~/theme'

const SIDEBAR_WIDTH_EXPANDED = 256
const SIDEBAR_WIDTH_COLLAPSED = 80

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallScreen = useMediaQuery('(min-width: 900px) and (max-width: 1240px)')
  const [isExpanded, setIsExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dispatch = useDispatch()
  const { mode, setMode } = useColorScheme()

  // Profile menu state
  const [anchorEl, setAnchorEl] = useState(null)
  const profileMenuOpen = Boolean(anchorEl)

  // Create menu state
  const [createMenuAnchorEl, setCreateMenuAnchorEl] = useState(null)
  const createMenuOpen = Boolean(createMenuAnchorEl)

  // Chatbot handler
  const [chatbotWindowOpen, setChatbotWindowOpen] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [numberOfNotifications, setNumberOfNotifications] = useState(2)
  const [newMessage, setNewMessage] = useState("You have a new message from TingTing Bot!")

  // Dynamic chatbot width based on screen size
  const chatbotWidth = isMobile ? '100vw' : isSmallScreen ? '45vw' : '30vw'

  // Dynamic sidebar width
  const sidebarWidth = isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED

  const menuItems = [
    { icon: <HomeIcon />, path: '/dashboard', label: 'Trang chủ' },
    { icon: <DescriptionIcon />, path: '/history', label: 'Hóa đơn của tôi' },
    { icon: <MenuBookIcon />, path: '/debt', label: 'Sổ tay nợ' },
    { icon: <GroupsIcon />, path: '/groups', label: 'Nhóm' },
    { icon: <TimelineIcon />, path: '/activity', label: 'Hoạt động' },
    { icon: <BarChartIcon />, path: '/reports', label: 'Báo cáo' },
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

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleCreateMenuOpen = (event) => {
    setCreateMenuAnchorEl(event.currentTarget)
  }

  const handleCreateMenuClose = () => {
    setCreateMenuAnchorEl(null)
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    handleProfileMenuClose()
  }

  const handleLogout = async () => {
    handleProfileMenuClose()
    try {
      await dispatch(logoutUserAPI(true)).unwrap()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        borderRight: '1px solid',
        borderColor: 'divider',
        position: 'relative',
      }}
    >
      {/* Header with Logo */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'flex-start' : 'center',
          minHeight: '64px',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontWeight: 700,
            fontSize: isExpanded ? '32px' : '28px',
            background: COLORS.gradientPrimary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            cursor: 'pointer',
            lineHeight: 1,
          }}
          onClick={() => handleNavigate('/dashboard')}
        >
          {isExpanded ? 'Splitly' : 'S'}
        </Typography>
      </Box>

      {/* Create New Bill Button */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={isExpanded ? <AddIcon /> : null}
          onClick={handleCreateMenuOpen}
          sx={{
            background: COLORS.gradientPrimary,
            color: 'white',
            borderRadius: '16px',
            height: '56px',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 500,
            boxShadow: '0px 10px 15px 0px rgba(0,0,0,0.1)',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            px: isExpanded ? 2.5 : 0,
            minWidth: isExpanded ? 'auto' : '48px',
            '&:hover': {
              background: COLORS.gradientPrimary,
              opacity: 0.9,
            },
          }}
        >
          {isExpanded ? 'Tạo hóa đơn mới' : <AddIcon />}
        </Button>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ px: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {menuItems.map((item, index) => {
          const isActive = isActivePath(item.path)
          return (
            <Tooltip
              key={index}
              title={!isExpanded ? item.label : ''}
              placement="right"
              arrow
            >
              <Button
                onClick={() => handleNavigate(item.path)}
                sx={{
                  justifyContent: isExpanded ? 'flex-start' : 'center',
                  borderRadius: '16px',
                  height: '48px',
                  px: isExpanded ? 2 : 0,
                  minWidth: isExpanded ? 'auto' : '48px',
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: isActive
                    ? mode === 'dark'
                      ? COLORS.primary
                      : COLORS.secondary
                    : 'text.primary',
                  background: isActive
                    ? mode === 'dark'
                      ? 'linear-gradient(90deg, rgba(239, 154, 154, 0.15) 0%, rgba(206, 147, 216, 0.15) 100%)'
                      : 'linear-gradient(90deg, rgba(74, 20, 140, 0.1) 0%, rgba(206, 147, 216, 0.1) 100%)'
                    : 'transparent',
                  '&:hover': {
                    background: isActive
                      ? mode === 'dark'
                        ? 'linear-gradient(90deg, rgba(239, 154, 154, 0.2) 0%, rgba(206, 147, 216, 0.2) 100%)'
                        : 'linear-gradient(90deg, rgba(74, 20, 140, 0.15) 0%, rgba(206, 147, 216, 0.15) 100%)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                  '& .MuiButton-startIcon': {
                    marginRight: isExpanded ? '12px' : 0,
                    marginLeft: 0,
                    color: isActive
                      ? mode === 'dark'
                        ? COLORS.primary
                        : COLORS.secondary
                      : 'inherit',
                  },
                }}
                startIcon={item.icon}
              >
                {isExpanded && item.label}
              </Button>
            </Tooltip>
          )
        })}
      </Box>

      {/* User Profile Section */}
      <Box
        onClick={handleProfileMenuOpen}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: isExpanded ? 2 : 0,
          justifyContent: isExpanded ? 'flex-start' : 'center',
          cursor: 'pointer',
          borderRadius: '16px',
          mx: 2,
          mb: 2,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: COLORS.gradientPrimary,
            fontSize: '16px',
            fontWeight: 400,
          }}
        >
          NA
        </Avatar>
        {isExpanded && (
          <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: '14px',
                color: 'text.primary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Nguyễn Văn A
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: '12px',
                color: 'text.secondary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              nguyenvana@example.com
            </Typography>
          </Box>
        )}
      </Box>

      {/* Toggle Button - Desktop Only */}
      {!isMobile && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: 'absolute',
            right: -12,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 24,
            height: 24,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: 'background.paper',
              borderColor: COLORS.primary,
            },
          }}
        >
          {isExpanded ? (
            <ChevronLeftIcon fontSize="small" />
          ) : (
            <ChevronRightIcon fontSize="small" />
          )}
        </IconButton>
      )}
    </Box>
  )

  const CreateMenu = (
    <Menu
      anchorEl={createMenuAnchorEl}
      open={createMenuOpen}
      onClose={handleCreateMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      sx={{
        '& .MuiPaper-root': {
          width: isExpanded ? 240 : 240,
          borderRadius: '16px',
          mt: 1,
        },
      }}
    >
      {/* Manual Creation */}
      <MenuItem
        onClick={() => {
          handleNavigate('/create')
          handleCreateMenuClose()
        }}
        sx={{
          py: 2,
          px: 2,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: COLORS.gradientPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <EditIcon sx={{ fontSize: 16, color: 'white' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '16px' }}>
              Tạo thủ công
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
              Nhập thông tin chi tiết
            </Typography>
          </Box>
        </Box>
      </MenuItem>

      {/* OCR Scan */}
      <MenuItem
        onClick={() => {
          // TODO: Implement OCR scan functionality
          handleCreateMenuClose()
        }}
        sx={{
          py: 2,
          px: 2,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CameraAltIcon sx={{ fontSize: 16, color: '#2196F3' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '16px' }}>
              Scan hóa đơn (OCR)
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
              Chụp ảnh để nhận diện
            </Typography>
          </Box>
        </Box>
      </MenuItem>

      {/* Chat with TingTing */}
      <MenuItem
        onClick={() => {
          // TODO: Implement chat with TingTing functionality
          handleCreateMenuClose()
        }}
        sx={{
          py: 2,
          px: 2,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(156, 39, 176, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ChatIcon sx={{ fontSize: 16, color: '#9C27B0' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '16px' }}>
              Chat với TingTing
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
              AI hỗ trợ tạo hóa đơn
            </Typography>
          </Box>
        </Box>
      </MenuItem>
    </Menu>
  )

  const ProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={profileMenuOpen}
      onClose={handleProfileMenuClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      sx={{
        '& .MuiPaper-root': {
          minWidth: 200,
          ml: 1,
        },
      }}
    >
      {/* Theme Mode Options */}
      <MenuItem onClick={() => handleModeChange('light')}>
        <ListItemIcon>
          <LightModeIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Light Mode</ListItemText>
        {mode === 'light' && <Box sx={{ ml: 1, color: COLORS.secondary }}>✓</Box>}
      </MenuItem>
      <MenuItem onClick={() => handleModeChange('dark')}>
        <ListItemIcon>
          <DarkModeIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Dark Mode</ListItemText>
        {mode === 'dark' && <Box sx={{ ml: 1, color: COLORS.secondary }}>✓</Box>}
      </MenuItem>
      <MenuItem onClick={() => handleModeChange('system')}>
        <ListItemIcon>
          <SettingsBrightnessIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>System</ListItemText>
        {mode === 'system' && <Box sx={{ ml: 1, color: COLORS.secondary }}>✓</Box>}
      </MenuItem>

      {/* Divider */}
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', my: 1 }} />

      {/* Logout */}
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  )

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Mobile Menu Button */}
      {isMobile && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1201,
            backgroundColor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: 'background.paper',
            },
          }}
        >
          <MenuIcon sx={{ color: COLORS.secondary }} />
        </IconButton>
      )}

      {/* Sidebar - Desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            transition: 'width 0.3s ease',
            '& .MuiDrawer-paper': {
              width: sidebarWidth,
              boxSizing: 'border-box',
              border: 'none',
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
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
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH_EXPANDED,
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
          backgroundColor: 'background.default',
          overflow: 'auto',
          paddingTop: isMobile ? '72px' : 0,
          transition: 'margin-right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          marginRight: !isMobile && chatbotWindowOpen ? chatbotWidth : '0',
        }}
      >
        {children}
      </Box>

      {/* Dark Mode Toggle Button - Top Right */}
      <IconButton
        onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        sx={{
          position: 'fixed',
          top: 16,
          right: chatbotWindowOpen && !isMobile ? `calc(${chatbotWidth} + 16px)` : 16,
          zIndex: 1200,
          width: 40,
          height: 40,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'background.paper',
            borderColor: COLORS.primary,
          },
        }}
      >
        {mode === 'dark' ? (
          <LightModeIcon fontSize="small" sx={{ color: COLORS.primary }} />
        ) : (
          <DarkModeIcon fontSize="small" sx={{ color: COLORS.secondary }} />
        )}
      </IconButton>

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

      {/* Create Menu */}
      {CreateMenu}

      {/* Profile Menu */}
      {ProfileMenu}
    </Box>
  )
}

export default Layout
