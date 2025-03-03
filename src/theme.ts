import { createTheme, ThemeOptions, Theme } from '@mui/material/styles';
import { PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface Palette {
    lighter?: string;
  }
  interface PaletteColor {
    lighter?: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
  }
}

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#1F4C6B', // Deeper blue for Islamic/professional look
      light: '#2D6E9B',
      dark: '#153449',
      lighter: '#E6EEF3',
    },
    secondary: {
      main: '#34866F', // Elegant green
      light: '#4AA88D',
      dark: '#246454',
      lighter: '#E8F4F1',
    },
    success: {
      main: '#28A745',
      light: '#48C664',
      dark: '#1E7E34',
      lighter: '#E8F5EC',
    },
    warning: {
      main: '#CB8A04', // Muted gold
      light: '#E0A52C',
      dark: '#946303',
      lighter: '#FEF6E6',
    },
    info: {
      main: '#2D6E9B',
      light: '#4A8BB8',
      dark: '#1F4C6B',
      lighter: '#E6EEF3',
    },
    error: {
      main: '#DC3545',
      light: '#E4606D',
      dark: '#A42834',
      lighter: '#FCECEE',
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#2D6E9B',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#E2E8F0',
        },
        head: {
          fontWeight: 600,
          color: '#1E293B',
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);