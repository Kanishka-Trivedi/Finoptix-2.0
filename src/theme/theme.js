import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#B8A4D9', // Soft lavender
      light: '#D4C4E8',
      dark: '#9B85C7',
      contrastText: '#2D2D2D',
    },
    secondary: {
      main: '#A4D9C4', // Soft mint
      light: '#C4E8D4',
      dark: '#85C7A8',
      contrastText: '#2D2D2D',
    },
    success: {
      main: '#A8D9A4',
      light: '#C8E8C4',
      dark: '#88C785',
    },
    error: {
      main: '#F5A4A4',
      light: '#FFC4C4',
      dark: '#E88585',
    },
    warning: {
      main: '#F5D4A4',
      light: '#FFE4C4',
      dark: '#E8C485',
    },
    info: {
      main: '#A4C4F5',
      light: '#C4D4FF',
      dark: '#85A8E8',
    },
    background: {
      default: '#FFFAF0', // Floral white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D2D2D',
      secondary: '#5D5D5D',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
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
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #B8A4D9 0%, #A4D9C4 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9B85C7 0%, #85C7A8 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
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
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
