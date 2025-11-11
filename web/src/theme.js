import { extendTheme } from '@mui/material/styles'

// ===== SPLITLY DESIGN SYSTEM COLORS =====
const COLORS = {
  primary: '#EF9A9A', // Primary Pink - main brand color
  secondary: '#4A148C', // Primary Purple - secondary brand color
  text: '#1A1A1A', // Dark text
  success: '#4CAF50', // Green - paid status
  warning: '#FF9800', // Orange - unpaid status
  info: '#2196F3', // Blue - pending status
  bgPrimary: '#FFFFFF', // White - main background
  bgSecondary: '#FAFAFA', // Off-white - cards/sections
  textMuted: '#757575', // Gray - helper text
  border: '#E5E7EB', // Light border color
  // Gradients
  gradientPrimary: 'linear-gradient(180deg, #EF9A9A 0%, #CE93D8 100%)', // Pink to Lavender
  gradientSecondary: 'linear-gradient(180deg, #4A148C 0%, #7B1FA2 100%)', // Purple to Light Purple
  gradientSoft: 'linear-gradient(180deg, #F8BBD0 0%, #E1BEE7 100%)', // Pastel Pink to Pastel Lavender
}

// App dimensions
const APP_BAR_HEIGHT = '58px'
const BOARD_BAR_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

const theme = extendTheme({
  colorSchemeSelector: 'class',
  defaultColorScheme: 'light',
  app: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT,
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: COLORS.primary,
          light: '#F8BBD0',
          dark: '#E57373',
          contrastText: '#1A1A1A',
        },
        secondary: {
          main: COLORS.secondary,
          light: '#7B1FA2',
          dark: '#311B92',
          contrastText: '#FFFFFF',
        },
        success: {
          main: COLORS.success,
        },
        warning: {
          main: COLORS.warning,
        },
        info: {
          main: COLORS.info,
        },
        text: {
          primary: COLORS.text,
          secondary: COLORS.textMuted,
        },
        background: {
          default: COLORS.bgPrimary,
          paper: COLORS.bgSecondary,
        },
        divider: COLORS.border,
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#F8BBD0', // Lighter pink for dark mode
          light: '#FCE4EC',
          dark: '#EF9A9A',
          contrastText: '#1A1A1A',
        },
        secondary: {
          main: '#CE93D8', // Lighter purple for dark mode
          light: '#E1BEE7',
          dark: '#4A148C',
          contrastText: '#FFFFFF',
        },
        success: {
          main: COLORS.success,
        },
        warning: {
          main: COLORS.warning,
        },
        info: {
          main: COLORS.info,
        },
        text: {
          primary: '#F3F4F6',
          secondary: '#D1D5DB',
        },
        background: {
          default: '#111827',
          paper: '#1F2937',
        },
        divider: '#374151',
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': { width: '8px', height: '8px' },
          '*::-webkit-scrollbar-thumb': { backgroundColor: COLORS.border, borderRadius: '8px' },
          '*::-webkit-scrollbar-thumb:hover': { backgroundColor: COLORS.primary },
        },
      },
    },
    // Customize MUI Button component
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: '600',
          borderRadius: '16px', // Default border radius from design system
          transition: 'all 0.2s ease',
        },
        contained: {
          boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem',
          },
        },
      },
    },
    // Customize MUI TextField component
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          borderRadius: '16px', // Default border radius from design system
          '& fieldset': {
            borderColor: COLORS.border,
            borderWidth: '1px !important',
          },
          '&:hover fieldset': {
            borderColor: COLORS.primary,
            borderWidth: '1px !important',
          },
          '&.Mui-focused fieldset': {
            borderColor: COLORS.secondary,
            borderWidth: '2px !important',
          },
        },
      },
    },
  },
})

export default theme
export { COLORS }
