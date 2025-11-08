import { extendTheme } from '@mui/material/styles'

// ===== SIMPLIFIED COLOR PALETTE =====
// Just 3 main colors + 3 status colors
const COLORS = {
  primary: '#0E7C88', // Teal - main brand color
  accent: '#E8563D', // Coral - secondary actions
  text: '#374151', // Dark gray - all text
  success: '#10B981', // Green - success/paid
  warning: '#FBBF24', // Amber - warning/pending
  error: '#EF4444', // Red - error/overdue
  bgPrimary: '#FFFFFF', // White - main background
  bgSecondary: '#FAFAFA', // Off-white - cards/sections
  textMuted: '#9CA3AF', // Light gray - helper text
  border: '#E5E7EB', // Light border color
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
          light: '#B3ECEB',
          dark: '#0A5F6B',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: COLORS.accent,
          light: '#F8A08B',
          dark: '#C63B2A',
          contrastText: '#FFFFFF',
        },
        success: {
          main: COLORS.success,
        },
        warning: {
          main: COLORS.warning,
        },
        error: {
          main: COLORS.error,
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
          main: '#4DBFD6', // Lighter teal for dark mode
          light: '#80DCF6',
          dark: '#0A5F6B',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: COLORS.accent,
          light: '#F8A08B',
          dark: '#C63B2A',
          contrastText: '#FFFFFF',
        },
        success: {
          main: COLORS.success,
        },
        warning: {
          main: COLORS.warning,
        },
        error: {
          main: COLORS.error,
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
          borderRadius: '6px',
          transition: 'all 0.2s ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
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
          '& fieldset': {
            borderColor: COLORS.border,
            borderWidth: '1px !important',
          },
          '&:hover fieldset': {
            borderColor: COLORS.primary,
            borderWidth: '1px !important',
          },
          '&.Mui-focused fieldset': {
            borderColor: COLORS.primary,
            borderWidth: '2px !important',
          },
        },
      },
    },
  },
})

export default theme
export { COLORS }
