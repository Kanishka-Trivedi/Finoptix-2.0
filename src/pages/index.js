import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { keyframes } from '@mui/system';
import BlobBackground from '../components/BlobBackground';
import SplitText from '../components/SplitText';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <AccountBalanceIcon sx={{ fontSize: 48 }} />,
      title: 'Explore Funds',
      description: 'Browse thousands of active mutual fund schemes',
      color: '#6C5CE7',
      link: '/funds',
    },
    {
      icon: <BookmarkIcon sx={{ fontSize: 48 }} />,
      title: 'Watchlist',
      description: 'Track performance of your favorite funds',
      color: '#00D2D3',
      link: '/watchlist',
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 48 }} />,
      title: 'Virtual Portfolio',
      description: 'Simulate and track your SIP investments',
      color: '#A29BFE',
      link: '/virtual-portfolio',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
      title: 'Calculators',
      description: 'SIP, SWP calculators with precise returns',
      color: '#00D2A0',
      link: '/funds',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E8E4F3 0%, #F5F3FF 50%, #E8E4F3 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BlobBackground variant="default" />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            pt: { xs: 8, md: 12 },
            pb: { xs: 6, md: 8 },
            textAlign: 'center',
            animation: `${fadeIn} 1s ease-out`,
          }}
        >
          <Box
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 800,
              mb: 2,
              textAlign: 'center',
              // Apply gradient to the entire text container
              position: 'relative',
            }}
          >
            <Box
              sx={{
                background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <SplitText
                text="Mutual Fund Explorer"
                delay={80}
                duration={800}
              />
            </Box>
          </Box>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 4,
              fontSize: { xs: '1rem', md: '1.5rem' },
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            Discover, analyze, and calculate returns on mutual fund investments with powerful tools and beautiful insights
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/funds')}
            sx={{
              fontSize: '1.2rem',
              px: 5,
              py: 2,
              background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
              boxShadow: '0 8px 24px rgba(108, 92, 231, 0.3)',
              '&:hover': {
                transform: 'scale(1.05)',
                background: 'linear-gradient(135deg, #5F4FD1 0%, #8B82E8 100%)',
                boxShadow: '0 12px 32px rgba(108, 92, 231, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Explore Funds
          </Button>
        </Box>

        {/* Features Section */}
        <Grid container spacing={4} sx={{ pb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                onClick={() => router.push(feature.link)}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: `2px solid ${feature.color}30`,
                  borderRadius: '24px',
                  animation: `${fadeIn} 1s ease-out ${index * 0.1}s backwards`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 32px ${feature.color}40`,
                  },
                }}
              >
                <Box
                  sx={{
                    color: feature.color,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Stats Section */}
        <Box
          sx={{
            pb: 8,
            animation: `${fadeIn} 1s ease-out 0.5s backwards`,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(108, 92, 231, 0.15)',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <BlobBackground variant="card" />
            <Grid container spacing={4} textAlign="center">
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  10,000+
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Mutual Fund Schemes
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #00D2D3 0%, #7FEFEF 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  Real-time
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  NAV Data
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #00D2A0 0%, #7FEFCF 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  Accurate
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Calculations
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
