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
      main: '#0070c9',
      light: '#3390d4',
      dark: '#004e8c',
      lighter: '#e6f2fb',
    },
    success: {
      main: '#34c759',
      light: '#5ad07a',
      dark: '#248b3e',
      lighter: '#e8f7ec',
    },
    warning: {
      main: '#ff9500',
      light: '#ffaa33',
      dark: '#b26800',
      lighter: '#fff4e5',
    },
    info: {
      main: '#5856d6',
      light: '#7977de',
      dark: '#3d3c95',
      lighter: '#eeeeff',
    },
    error: {
      main: '#ff3b30',
      light: '#ff6259',
      dark: '#b22921',
      lighter: '#ffe5e4',
    },
    grey: {
      50: '#f9f9f9',
      100: '#f2f2f2',
      200: '#e6e6e6',
      300: '#cccccc',
      400: '#b3b3b3',
      500: '#999999',
      600: '#808080',
      700: '#666666',
      800: '#4d4d4d',
      900: '#333333',
    },
    text: {
      primary: '#1d1d1f',
      secondary: '#86868b',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
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
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
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
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);