import { useState } from 'react'
import {
  Box,
  Drawer,
  IconButton,
  Avatar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
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
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { COLORS } from '~/theme'

const SIDEBAR_WIDTH_EXPANDED = 256
const SIDEBAR_WIDTH_COLLAPSED = 80

const Sidebar = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [isExpanded, setIsExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

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

  const handleNavigate = (path) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
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
        {isExpanded && (
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 700,
              fontSize: '24px',
              background: COLORS.gradientPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              cursor: 'pointer',
            }}
            onClick={() => handleNavigate('/dashboard')}
          >
            Splitly
          </Typography>
        )}
        {!isExpanded && (
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 700,
              fontSize: '24px',
              background: COLORS.gradientPrimary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              cursor: 'pointer',
            }}
            onClick={() => handleNavigate('/dashboard')}
          >
            S
          </Typography>
        )}
      </Box>

      {/* Create New Bill Button */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={isExpanded ? <AddIcon /> : null}
          onClick={() => handleNavigate('/create')}
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
                  color: isActive ? COLORS.secondary : 'text.primary',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(74, 20, 140, 0.1) 0%, rgba(206, 147, 216, 0.1) 100%)'
                    : 'transparent',
                  '&:hover': {
                    background: isActive
                      ? 'linear-gradient(90deg, rgba(74, 20, 140, 0.15) 0%, rgba(206, 147, 216, 0.15) 100%)'
                      : 'rgba(0, 0, 0, 0.04)',
                  },
                  '& .MuiButton-startIcon': {
                    marginRight: isExpanded ? '12px' : 0,
                    marginLeft: 0,
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

      {/* Desktop Drawer */}
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

      {/* Mobile Drawer */}
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
          marginLeft: isMobile ? 0 : 0,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Sidebar
