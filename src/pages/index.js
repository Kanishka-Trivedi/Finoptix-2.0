import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { keyframes } from '@mui/system';

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
      color: '#B8A4D9',
      link: '/funds',
    },
    {
      icon: <BookmarkIcon sx={{ fontSize: 48 }} />,
      title: 'Watchlist',
      description: 'Track performance of your favorite funds',
      color: '#A4D9C4',
      link: '/watchlist',
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 48 }} />,
      title: 'Virtual Portfolio',
      description: 'Simulate and track your SIP investments',
      color: '#F5D4A4',
      link: '/virtual-portfolio',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
      title: 'Calculators',
      description: 'SIP, SWP calculators with precise returns',
      color: '#A4C4F5',
      link: '/funds',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFFAF0 0%, #F0FFF0 50%, #FFF0F5 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184,164,217,0.2) 0%, transparent 70%)',
          animation: `${float} 6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(164,217,196,0.2) 0%, transparent 70%)',
          animation: `${float} 8s ease-in-out infinite`,
        }}
      />

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
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 800,
              background: 'linear-gradient(135deg, #B8A4D9 0%, #A4D9C4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Mutual Fund Explorer
          </Typography>
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
              boxShadow: '0 8px 24px rgba(184,164,217,0.3)',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 12px 32px rgba(184,164,217,0.4)',
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
                  background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}05 100%)`,
                  border: `2px solid ${feature.color}30`,
                  animation: `${fadeIn} 1s ease-out ${index * 0.1}s backwards`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 32px ${feature.color}30`,
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
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(184,164,217,0.2)',
            }}
          >
            <Grid container spacing={4} textAlign="center">
              <Grid item xs={12} md={4}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #B8A4D9 0%, #A4D9C4 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
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
                    background: 'linear-gradient(135deg, #A4D9C4 0%, #F5D4A4 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
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
                    background: 'linear-gradient(135deg, #F5D4A4 0%, #A4C4F5 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
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
