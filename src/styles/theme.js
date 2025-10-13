import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6C5CE7', // Purple
      light: '#A29BFE',
      dark: '#5F4FD1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00D2D3', // Cyan/Teal
      light: '#7FEFEF',
      dark: '#00A8A9',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#E8E4F3', // Light purple background
      paper: '#FFFFFF',
    },
    success: {
      main: '#00D2A0',
      light: '#7FEFCF',
      dark: '#00A87F',
    },
    warning: {
      main: '#FFB800',
      light: '#FFD966',
      dark: '#CC9300',
    },
    error: {
      main: '#FF6B9D',
      light: '#FFB5D0',
      dark: '#CC567E',
    },
    text: {
      primary: '#2D3436',
      secondary: '#636E72',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(108, 92, 231, 0.25)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5F4FD1 0%, #8B82E8 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(108, 92, 231, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(108, 92, 231, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
