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
// removed Avatar and theme icons per design request
import { useRouter } from 'next/router';
import { TrendingUp, Menu as MenuIcon, Eye, Wallet, User } from 'lucide-react';
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

const Header = ({ toggleTheme, themeMode }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const trigger = useScrollTrigger({
    threshold: 100,
  });

  const navigationItems = [
    { label: 'Funds', path: '/funds', icon: TrendingUp },
    { label: 'Watchlist', path: '/watchlist', icon: Eye },
    { label: 'Portfolio', path: '/virtual-portfolio', icon: Wallet },
    { label: 'Profile', path: '/profile', icon: User },
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
            background: (t) => t.customColors?.background || 'linear-gradient(90deg,#071027 0%, #08122a 100%)',
            borderBottom: (t) => `1px solid ${t.customColors ? 'rgba(6,182,212,0.08)' : 'rgba(6,182,212,0.08)'}`,
            borderRadius: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backdropFilter: 'blur(6px)'
          }}
        >
          <Toolbar sx={{ py: 1, display: 'flex', alignItems: 'center' }}>
            {/* Left: Logo */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', mr: 2, cursor: 'pointer', animation: `${float} 3s ease-in-out infinite` }}
              onClick={() => handleNavigation('/')}
            >
              <Box sx={{ width: 44, height: 44, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', background: (t) => t.customColors?.heroGradient || 'linear-gradient(135deg,#06b6d4,#7c3aed,#fb7185)', boxShadow: '0 8px 30px rgba(99,102,241,0.12)', mr: 1 }}>
                <TrendingUp color="#0b1220" size={18} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(90deg,#06b6d4,#7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em',
                    fontSize: '1.125rem'
                  }}
                >
                  Finoptix 2.0
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                  Mutual Fund Explorer
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }} />

            {/* Right: Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              {navigationItems.map((item) => {
                const active = router.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    variant="text"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1.5,
                      color: active ? (t) => t.customColors?.accentTeal || '#06b6d4' : 'rgba(255,255,255,0.92)',
                      fontWeight: 700,
                      textTransform: 'none',
                      px: 2.5,
                      py: 0.7,
                      borderRadius: '9999px',
                      background: active ? (t) => `${t.customColors ? 'rgba(2,6,23,0.5)' : 'rgba(2,6,23,0.5)'}` : 'transparent',
                      transition: 'all 0.18s ease',
                      '&:hover': {
                        background: (t) => t.customColors ? 'rgba(5,20,40,0.7)' : 'rgba(5,20,40,0.7)',
                        color: (t) => t.customColors?.accentTeal || '#06b6d4',
                        boxShadow: (t) => `0 8px 30px rgba(6,182,212,0.06)`
                      },
                      '& .navIconBox': {
                        width: 28,
                        height: 28,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1.5,
                        background: active ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.02)',
                        transition: 'all 0.18s ease',
                        color: active ? '#06b6d4' : 'inherit'
                      },
                      '&:hover .navIconBox': {
                        background: (t) => `linear-gradient(90deg, rgba(6,182,212,0.12), rgba(124,58,237,0.08))`,
                        color: (t) => t.customColors?.accentTeal || '#06b6d4'
                      }
                    }}
                  >
                    <Box className="navIconBox" sx={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1.5, background: active ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.02)' }}>
                      <item.icon color={active ? '#06b6d4' : 'white'} size={16} />
                    </Box>
                    <Box component="span" sx={{ ml: 0.5 }}>{item.label}</Box>
                  </Button>
                );
              })}
            </Box>

            {/* Right: Actions (profile + theme) */}
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
            ) : null}
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
