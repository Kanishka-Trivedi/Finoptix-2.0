import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import { useRouter } from 'next/router';
import MenuIcon from '@mui/icons-material/Menu';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { keyframes } from '@mui/system';

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(184, 164, 217, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(184, 164, 217, 0.8), 0 0 30px rgba(164, 217, 196, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(184, 164, 217, 0.5);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-2px);
  }
`;

const Header = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const trigger = useScrollTrigger({
    threshold: 100,
  });

  const navigationItems = [
    { label: 'Funds', path: '/funds' },
    { label: 'Watchlist', path: '/watchlist' },
    { label: 'Virtual Portfolio', path: '/virtual-portfolio' },
  ];

  const handleNavigation = (path) => {
    router.push(path);
    setMobileOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: '#6C5CE7',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 0
          }}
        >
          <Toolbar sx={{ py: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
                animation: `${float} 3s ease-in-out infinite`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: 2,
                  p: 1,
                  borderRadius: 2,
                }}
              >
                <TrendingUpIcon sx={{ mr: 1, color: 'white', fontSize: 28 }} />
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #2D2D2D 0%, #5D5D5D 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Finoptix 2.0
                </Typography>
              </Box>
            </Box>

            {isMobile ? (
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{
                  '&:hover': {
                    background: 'white',
                    '& .MuiSvgIcon-root': {
                      color: '#6C5CE7',
                    },
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    variant={router.pathname === item.path ? 'contained' : 'text'}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      background: router.pathname === item.path ? 'white' : 'transparent',
                      color: router.pathname === item.path ? '#6C5CE7' : 'white',
                      '&:hover': {
                        background: 'white',
                        color: '#6C5CE7',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Slide>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            background: '#6C5CE7',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
            Navigation
          </Typography>
          <List>
            {navigationItems.map((item) => (
              <ListItem
                button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  background: router.pathname === item.path ? 'white' : 'transparent',
                  color: router.pathname === item.path ? '#6C5CE7' : 'white',
                  '&:hover': {
                    background: 'white',
                    color: '#6C5CE7',
                    transform: 'translateX(4px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Toolbar /> {/* Spacer for fixed AppBar */}
    </>
  );
};

export default Header;
