import { createTheme } from '@mui/material/styles';

// Dark theme tokens from user
export const darkThemeColors = {
  background: '#0B0B24',
  heroGradient: 'linear-gradient(135deg, #00D2D3 0%, #A29BFE 100%)', // Teal to Purple
  textPrimary: '#FFFFFF',
  textSecondary: '#A9A7C7',
  buttonPrimaryBg: '#FFB800', // Yellow/Gold for main button
  buttonSecondaryBg: 'rgba(255, 255, 255, 0.1)',
  cardBg: 'rgba(255, 255, 255, 0.05)',
  accentTeal: '#00D2D3',
  accentPurple: '#A29BFE',
  accentRed: '#FF6B9D',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: darkThemeColors.accentTeal,
      light: darkThemeColors.accentTeal,
      dark: darkThemeColors.accentPurple,
      contrastText: darkThemeColors.textPrimary,
    },
    secondary: {
      main: darkThemeColors.accentPurple,
      light: darkThemeColors.accentPurple,
      dark: darkThemeColors.accentTeal,
      contrastText: darkThemeColors.textPrimary,
    },
    success: {
      main: darkThemeColors.accentTeal,
      light: darkThemeColors.accentTeal,
      dark: darkThemeColors.accentTeal,
    },
    error: {
      main: darkThemeColors.accentRed,
      light: darkThemeColors.accentRed,
      dark: darkThemeColors.accentRed,
    },
    warning: {
      main: darkThemeColors.buttonPrimaryBg,
      light: darkThemeColors.buttonPrimaryBg,
      dark: darkThemeColors.buttonPrimaryBg,
    },
    info: {
      main: darkThemeColors.accentPurple,
      light: darkThemeColors.accentPurple,
      dark: darkThemeColors.accentPurple,
    },
    background: {
      default: darkThemeColors.background,
      paper: darkThemeColors.cardBg,
    },
    text: {
      primary: darkThemeColors.textPrimary,
      secondary: darkThemeColors.textSecondary,
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
              background: darkThemeColors.heroGradient,
              '&:hover': {
                background: `linear-gradient(135deg, ${darkThemeColors.accentTeal} 0%, ${darkThemeColors.accentPurple} 100%)`,
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
  customColors: darkThemeColors,
});

export default theme;
