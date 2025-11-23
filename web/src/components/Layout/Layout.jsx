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
  Badge,
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
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ChatbotButton from '~/components/Chatbot/ChatbotButton'
import ChatbotWindow from '../Chatbot/ChatbotWindow'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice'
import {
  fetchNotificationsAPI,
  addNotification,
  setNotificationRead,
  setAllNotificationsRead,
  setUnreadCount,
  selectUnreadCount,
} from '~/redux/notification/notificationSlice'
import { useColorScheme } from '@mui/material/styles'
import { COLORS } from '~/theme'
import { useChatbot } from '~/context/ChatbotContext'
import { getInitials } from '~/utils/formatters'
import LogoRounded from '~/assets/Splitly-Rounded.png'
import LogoFull from '~/assets/Splitly-Full.png'
import { socketIoInstance } from '~/main'
import { toast } from 'react-toastify'

const SIDEBAR_WIDTH_EXPANDED = 256
const SIDEBAR_WIDTH_COLLAPSED = 88

const Layout = ({ children }) => {
  const currentUser = useSelector(selectCurrentUser)
  const unreadNotificationCount = useSelector(selectUnreadCount)
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

  // Use Chatbot Context
  const { chatbotWindowOpen, setChatbotWindowOpen, numberOfNotifications, newMessage, setNewMessage } = useChatbot()

  // Fetch initial notifications and setup socket listeners
  useEffect(() => {
    if (!currentUser?._id) return

    // Fetch initial notifications
    dispatch(fetchNotificationsAPI({ limit: 10, offset: 0 }))

    // Join notification room
    socketIoInstance.emit('FE_JOIN_NOTIFICATION_ROOM', currentUser._id)

    // Listen for new notifications
    const handleNewNotification = (notification) => {
      if (notification?.recipientId === currentUser._id) {
        dispatch(addNotification(notification))
        // Show toast notification
        toast.info(notification.title || 'Bạn có thông báo mới', { theme: 'colored' })
      }
    }

    // Listen for notification read (from other devices)
    const handleNotificationRead = ({ notificationId, userId }) => {
      if (userId === currentUser._id) {
        dispatch(setNotificationRead({ notificationId }))
      }
    }

    // Listen for all notifications read (from other devices)
    const handleAllNotificationsRead = ({ userId }) => {
      if (userId === currentUser._id) {
        dispatch(setAllNotificationsRead())
      }
    }

    // Listen for unread count update
    const handleUnreadCountUpdate = ({ userId, count }) => {
      if (userId === currentUser._id) {
        dispatch(setUnreadCount(count))
      }
    }

    socketIoInstance.on('BE_NEW_NOTIFICATION', handleNewNotification)
    socketIoInstance.on('BE_NOTIFICATION_READ', handleNotificationRead)
    socketIoInstance.on('BE_ALL_NOTIFICATIONS_READ', handleAllNotificationsRead)
    socketIoInstance.on('BE_UNREAD_COUNT_UPDATE', handleUnreadCountUpdate)

    // Cleanup on unmount
    return () => {
      socketIoInstance.emit('FE_LEAVE_NOTIFICATION_ROOM', currentUser._id)
      socketIoInstance.off('BE_NEW_NOTIFICATION', handleNewNotification)
      socketIoInstance.off('BE_NOTIFICATION_READ', handleNotificationRead)
      socketIoInstance.off('BE_ALL_NOTIFICATIONS_READ', handleAllNotificationsRead)
      socketIoInstance.off('BE_UNREAD_COUNT_UPDATE', handleUnreadCountUpdate)
    }
  }, [currentUser?._id, dispatch])

  // Check for chatbot payload from navigation state or URL params
  useEffect(() => {
    // Check navigation state
    if (location.state?.chatbotWindowOpen === true) {
      setChatbotWindowOpen(true)
      // Clear the state to prevent reopening on future navigations
      window.history.replaceState({}, document.title)
    }

    // Check URL params
    const searchParams = new URLSearchParams(location.search)
    if (searchParams.get('chatbotWindowOpen') === 'true') {
      setChatbotWindowOpen(true)
      // Remove the param from URL
      searchParams.delete('chatbotWindowOpen')
      const newSearch = searchParams.toString()
      const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`
      window.history.replaceState({}, document.title, newUrl)
    }
  }, [location])

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
          justifyContent: 'center',
          minHeight: 96,
        }}
      >
        {(isMobile || isExpanded) && (
          <img
            src={LogoFull}
            alt="Splitly Logo"
            style={{ height: 64, cursor: 'pointer' }}
            onClick={() => handleNavigate('/dashboard')}
          />
        )}
        {!isMobile && !isExpanded && (
          <img
            src={LogoRounded}
            alt="Splitly Logo"
            style={{ height: 40, cursor: 'pointer' }}
            onClick={() => handleNavigate('/dashboard')}
          />
        )}
      </Box>

      {/* Create New Bill Button */}
      <Box sx={{ display: 'flex', px: 2, mb: 2 }}>
        <Button
          variant="contained"
          fullWidth
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile || isExpanded ? '8px' : 0,
            px: 2.5,
            minWidth: 0,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: COLORS.gradientPrimary,
              opacity: 0.9,
            },
          }}
        >
          <AddIcon sx={{ fontSize: '20px' }} />
          <Box
            component="span"
            sx={{
              opacity: isMobile || isExpanded ? 1 : 0,
              width: isMobile || isExpanded ? 'auto' : 0,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              transitionDelay: isMobile || isExpanded ? '0.1s' : '0s',
            }}
          >
            Tạo hóa đơn mới
          </Box>
        </Button>
      </Box>

      {/* Navigation Items */}
      <Box sx={{ px: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {menuItems.map((item, index) => {
          const isActive = isActivePath(item.path)
          return (
            <Tooltip key={index} title={!isExpanded ? item.label : ''} placement="right" arrow>
              <Button
                onClick={() => handleNavigate(item.path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: isMobile || isExpanded ? '12px' : 0,
                  borderRadius: '16px',
                  height: '48px',
                  px: 2,
                  minWidth: 0,
                  textTransform: 'none',
                  fontSize: '16px',
                  fontWeight: 400,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: isActive ? (mode === 'dark' ? COLORS.primary : COLORS.secondary) : 'text.primary',
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
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    flexShrink: 0,
                    color: isActive ? (mode === 'dark' ? COLORS.primary : COLORS.secondary) : 'inherit',
                  }}
                >
                  {item.icon}
                </Box>
                <Box
                  component="span"
                  sx={{
                    opacity: isMobile || isExpanded ? 1 : 0,
                    width: isMobile || isExpanded ? 'auto' : 0,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: isMobile || isExpanded ? '0.1s' : '0s',
                  }}
                >
                  {item.label}
                </Box>
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
          gap: isMobile || isExpanded ? 2 : 0,
          justifyContent: isMobile || isExpanded ? 'flex-start' : 'center',
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
          {getInitials(currentUser?.name)}
        </Avatar>
        {(isMobile || isExpanded) && (
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
              {currentUser?.name}
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
              {currentUser?.email}
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
            width: 30,
            height: 60,
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
          {isExpanded ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
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
          handleNavigate('/ocr')
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
          navigate('/create', {
            state: {
              chatbotWindowOpen: true,
              billFormData: null,
            },
          })
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
      {/* Profile and Settings */}
      <MenuItem
        onClick={() => {
          handleNavigate('/profile')
          handleProfileMenuClose()
        }}
      >
        <ListItemIcon>
          <PersonIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleNavigate('/settings')
          handleProfileMenuClose()
        }}
      >
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Settings</ListItemText>
      </MenuItem>

      {/* Divider */}
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', my: 1 }} />
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
      {isMobile && !mobileOpen && (
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
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '& .MuiDrawer-paper': {
              width: sidebarWidth,
              boxSizing: 'border-box',
              border: 'none',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              overflowX: 'hidden',
              willChange: 'width',
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
      {/* <IconButton
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
      </IconButton> */}

      {/* Notifications Button - Top Right */}
      <IconButton
        onClick={() => navigate('/activity')}
        sx={{
          position: 'fixed',
          top: 16,
          right: chatbotWindowOpen && !isMobile ? `calc(${chatbotWidth} + 16px)` : 20,
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
        <Badge
          badgeContent={unreadNotificationCount}
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '10px',
              minWidth: '18px',
              height: '18px',
              background: COLORS.gradientPrimary,
            },
          }}
        >
          <NotificationsIcon fontSize="small" sx={{ color: 'text.primary' }} />
        </Badge>
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
          transform: chatbotWindowOpen ? 'translate(0, 0)' : isMobile ? 'translateY(100%)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1199,
          borderTopLeftRadius: isMobile ? '20px' : 0,
          borderTopRightRadius: isMobile ? '20px' : 0,
          overflow: 'hidden',
        }}
      >
        <ChatbotWindow isOpen={chatbotWindowOpen} setIsOpen={setChatbotWindowOpen} />
      </Box>

      {/* Create Menu */}
      {CreateMenu}

      {/* Profile Menu */}
      {ProfileMenu}
    </Box>
  )
}

export default Layout
