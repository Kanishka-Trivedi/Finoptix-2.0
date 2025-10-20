import { Box, Container, Typography, Button, Paper, Grid, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import ShieldIcon from '@mui/icons-material/Shield';
import BoltIcon from '@mui/icons-material/Bolt';
import { keyframes } from '@mui/system';
import BlobBackground from '../components/BlobBackground';
import Header from '../components/Header';
import { useReveal } from '../hooks/useReveal'; // <-- IMPORTED NEW HOOK

// Keyframes for Hero Section (Immediate fade-in)
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// New Dark Theme Inspired Colors
const darkThemeColors = {
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

// =================================================================
// REVEAL ANIMATION UTILITY COMPONENTS
// =================================================================

const HeaderSection = () => {
  const { ref, isVisible } = useReveal({ threshold: 0.2 });
  return (
    <Box 
        ref={ref} 
        sx={{ 
            mb: 4, 
            textAlign: 'center',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          background: darkThemeColors.heroGradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
          fontSize: 50,
        }}
      >
        Powerful Features
      </Typography>
      <Typography variant="h6" sx={{ color: darkThemeColors.textSecondary }}>
        Everything you need to make informed investment decisions
      </Typography>
    </Box>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => {
    const { ref, isVisible } = useReveal({ threshold: 0.1 });
    return (
        <Paper
            ref={ref}
            elevation={4}
            sx={{
                p: 4,
                height: '100%',
                textAlign: 'left',
                background: darkThemeColors.cardBg,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(162, 155, 254, 0.1)',
                borderRadius: '20px',
                transition: `all 0.6s ease-out ${delay}s`,
                position: 'relative',
                overflow: 'hidden',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                '&:hover': {
                    transform: isVisible ? 'scale(1.03)' : 'translateY(30px)', // Maintain hover effect after visibility
                    boxShadow: '0 10px 40px rgba(162, 155, 254, 0.2)',
                },
            }}
        >
            <Box
                sx={{
                    color: darkThemeColors.accentTeal,
                    mb: 2,
                    fontSize: 48,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                {icon}
            </Box>
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: darkThemeColors.textPrimary,
                    mb: 1,
                }}
            >
                {title}
            </Typography>
            <Typography variant="body1" sx={{ color: darkThemeColors.textSecondary, lineHeight: 1.6 }}>
                {description}
            </Typography>
        </Paper>
    );
};

const InvestmentCard = ({ name, category, nav, y1r, y3r, color, isActive = true, delay }) => {
    const { ref, isVisible } = useReveal({ threshold: 0.1 });
    return (
        <Paper
            ref={ref}
            elevation={4}
            onClick={() => { /* Mock navigation */ }}
            sx={{
                p: 4,
                height: '100%',
                textAlign: 'left',
                background: darkThemeColors.cardBg,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(108, 92, 231, 0.2)',
                borderRadius: '20px',
                fontSize: 50,
                transition: `all 0.6s ease-out ${delay}s`,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                '&:hover': {
                    transform: isVisible ? 'translateY(-5px)' : 'translateY(30px)',
                    boxShadow: `0 10px 30px ${color}30`,
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: darkThemeColors.textPrimary }}>
                    {name}
                </Typography>
                {!isActive && (
                    <Typography variant="caption" sx={{ color: darkThemeColors.accentRed, fontWeight: 700, p: 0.5, border: `1px solid ${darkThemeColors.accentRed}`, borderRadius: 1 }}>
                        Inactive
                    </Typography>
                )}
            </Box>
            <Typography variant="body2" sx={{ color: darkThemeColors.textSecondary, mb: 2 }}>
                {category}
            </Typography>
            
            <Box 
                sx={{ 
                    height: 30, 
                    mb: 2, 
                    background: `linear-gradient(to right, ${color}30, ${color}90)`,
                    borderRadius: '5px'
                }} 
            />

            <Grid container spacing={1}>
                <Grid item xs={4}>
                    <Typography variant="caption" sx={{ color: darkThemeColors.textSecondary, display: 'block' }}>NAV</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: darkThemeColors.textPrimary }}>{nav}</Typography>
                    <Typography variant="caption" sx={{ color: color }}>+2.34%</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: darkThemeColors.textSecondary, display: 'block' }}>1Y Returns</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: darkThemeColors.accentTeal }}>{y1r}</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: darkThemeColors.textSecondary, display: 'block' }}>3Y Returns</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: darkThemeColors.accentTeal }}>{y3r}</Typography>
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                    onClick={(e) => e.stopPropagation()}
                    variant="outlined"
                    size="small"
                    startIcon={<BookmarkIcon sx={{ fontSize: 16 }} />}
                    sx={{
                        color: darkThemeColors.accentPurple,
                        borderColor: darkThemeColors.accentPurple,
                        borderRadius: '10px',
                        '&:hover': {
                            borderColor: darkThemeColors.accentPurple,
                            backgroundColor: `${darkThemeColors.accentPurple}10`,
                        }
                    }}
                >
                    Add to Watchlist
                </Button>
                <Button 
                    onClick={(e) => e.stopPropagation()}
                    size="small"
                    sx={{
                        color: darkThemeColors.accentTeal,
                        minWidth: 40,
                    }}
                >
                    <TrendingUpIcon />
                </Button>
            </Box>
        </Paper>
    );
};

const StatsCard = ({ title, value, color, delay }) => {
    const { ref, isVisible } = useReveal({ threshold: 0.1 });
    return (
        <Paper
            ref={ref}
            elevation={4}
            sx={{
                p: 4,
                height: '100%',
                textAlign: 'center',
                background: darkThemeColors.cardBg,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(162, 155, 254, 0.1)',
                borderRadius: '20px',
                transition: `all 0.6s ease-out ${delay}s`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                '&:hover': {
                    transform: isVisible ? 'scale(1.03)' : 'translateY(30px)',
                    boxShadow: `0 10px 40px ${color}20`,
                },
            }}
        >
            <Typography variant="h3" sx={{ fontWeight: 800, color: color, mb: 1 }}>
                {value}
            </Typography>
            <Typography variant="body1" sx={{ color: darkThemeColors.textSecondary }}>
                {title}
            </Typography>
        </Paper>
    );
};

// =================================================================
// MAIN COMPONENT
// =================================================================

const Home = () => {
  const router = useRouter();
  const [themeMode, setThemeMode] = useState('light');

  const toggleTheme = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const features = [
    { icon: <SearchIcon sx={{ fontSize: 48 }} />, title: 'Smart Fund Search', description: 'Find the perfect funds with intelligent filtering by category, risk, AMC, and performance metrics.' },
    { icon: <ShowChartIcon sx={{ fontSize: 48 }} />, title: 'Rolling Returns Analysis', description: 'Visualize fund performance over time with interactive rolling returns charts and distributions.' },
    { icon: <CalculateIcon sx={{ fontSize: 48 }} />, title: 'Investment Calculators', description: 'Plan your SIP, SWP, lumpsum, and step-up investments with instant projections.' },
  ];

  const valueProps = [
    { icon: <BookmarkIcon sx={{ fontSize: 48 }} />, title: 'Custom Watchlists', description: 'Track your favorite funds and get real-time alerts on NAV changes and important updates.' },
    { icon: <ShieldIcon sx={{ fontSize: 48 }} />, title: 'Risk Assessment', description: 'Understand fund volatility with comprehensive risk metrics and historical analysis.' },
    { icon: <BoltIcon sx={{ fontSize: 48 }} />, title: 'Real-time Data', description: 'Access live NAV updates, market trends, and instant portfolio valuations.' },
  ];

  const stats = [
    { title: 'Mutual Funds', value: '2,500+', color: darkThemeColors.accentPurple },
    { title: 'Total AUM', value: '₹50L Cr+', color: darkThemeColors.accentRed },
    { title: 'Avg Returns', value: '15%', color: darkThemeColors.accentTeal },
  ];
  
  const staticFundItems = [
    { id: 1, name: 'HDFC Balanced Advantage Fund', category: 'Hybrid • Moderate Risk', nav: '₹352.45', y1r: '+15.2%', y3r: '+18.5%', color: darkThemeColors.accentTeal, isActive: true },
    { id: 2, name: 'SBI Bluechip Fund', category: 'Equity • High Risk', nav: '₹68.89', y1r: '+22.1%', y3r: '+16.8%', color: darkThemeColors.accentPurple, isActive: true },
    { id: 3, name: 'ICICI Prudential Liquid Fund', category: 'Debt • Low Risk', nav: '₹312.15', y1r: '+6.8%', y3r: '+6.2%', color: darkThemeColors.accentTeal, isActive: true },
    { id: 4, name: 'Axis Midcap Fund', category: 'Equity • Very High Risk', nav: '₹89.34', y1r: '+28.5%', y3r: '+22.3%', color: darkThemeColors.accentRed, isActive: false },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: darkThemeColors.background,
        py: 0,
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        // Hide scrollbar for webkit browsers
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        // Hide scrollbar for Firefox
        scrollbarWidth: 'none',
        // Hide scrollbar for IE/Edge
        msOverflowStyle: 'none',
        // Enable smooth scrolling
        scrollBehavior: 'smooth',
      }}
    >
      <Header toggleTheme={toggleTheme} themeMode={themeMode} />
      <BlobBackground variant="default" />

  <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 4 }}>
        {/*
          ===========================
          SECTION 1: HERO (Immediate Fade In)
          ===========================
        */}
        <Box
          sx={{
            pt: { xs: 2, md: 4 },
            pb: { xs: 4, md: 6 },
            textAlign: 'center',
            animation: `${fadeIn} 1s ease-out`, 
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
              lineHeight: 1.1,
              mb: 2,
              textAlign: 'center',
              color: darkThemeColors.textPrimary,
              textShadow: `0 0 10px ${darkThemeColors.accentTeal}40, 0 0 20px ${darkThemeColors.accentTeal}30`,
            }}
          >
            <Box
              component="span"
              sx={{
                background: darkThemeColors.heroGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Explore Funds,
            </Box>
            <Box
              component="span"
              sx={{
                display: 'block',
              }}
            >
              Build Wealth
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              mb: 5,
              fontSize: { xs: '1rem', md: '1.25rem' },
              maxWidth: '700px',
              mx: 'auto',
              color: darkThemeColors.textSecondary,
            }}
          >
            Navigate the mutual fund universe with powerful tools, real-time insights, and intelligent analytics
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/funds')}
            sx={{
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              borderRadius: '12px',
              background: darkThemeColors.buttonPrimaryBg,
              color: darkThemeColors.background, 
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(255, 184, 0, 0.3)',
              '&:hover': {
                background: darkThemeColors.buttonPrimaryBg,
                transform: 'scale(1.05)',
                boxShadow: '0 12px 32px rgba(255, 184, 0, 0.4)',
              },
            }}
          >
            Explore Funds →
          </Button>
        </Box>

        {/*
          ===========================
          SECTION 2: STATS (Reveal Applied)
          ===========================
        */}
        <Box sx={{ pt: 4, pb: 8, textAlign: 'center' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  background: darkThemeColors.cardBg,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(162, 155, 254, 0.1)',
                  borderRadius: '20px',
                  transition: 'all 0.6s ease-out',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 10px 40px rgba(108, 92, 231, 0.2)',
                  },
                }}
              >
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
                <Typography variant="body1" sx={{ color: darkThemeColors.textSecondary, mt: 1 }}>
                  Mutual Fund Schemes
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  background: darkThemeColors.cardBg,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(162, 155, 254, 0.1)',
                  borderRadius: '20px',
                  transition: 'all 0.6s ease-out',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 10px 40px rgba(0, 210, 211, 0.2)',
                  },
                }}
              >
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
                <Typography variant="body1" sx={{ color: darkThemeColors.textSecondary, mt: 1 }}>
                  NAV Data
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  background: darkThemeColors.cardBg,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(162, 155, 254, 0.1)',
                  borderRadius: '20px',
                  transition: 'all 0.6s ease-out',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 10px 40px rgba(0, 210, 160, 0.2)',
                  },
                }}
              >
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
                <Typography variant="body1" sx={{ color: darkThemeColors.textSecondary, mt: 1 }}>
                  Calculations
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/*
          ===========================
          SECTION 3: FEATURES (Reveal Applied)
          ===========================
        */}
        <Box sx={{ pt: 8, pb: 8, textAlign: 'center' }}>
          <HeaderSection />
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 0.1} // Staggered reveal
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/*
          ===========================
          SECTION 4: FUND EXPLORER/ITEMS (Reveal Applied)
          ===========================
        */}
        <Box sx={{ pt: 4, pb: 8, textAlign: 'center' }}>
            <HeaderSectionTitle 
                title="Fund Explorer" 
                subtitle="Search, filter, and analyze thousands of mutual funds with real-time data"
                gradient={darkThemeColors.heroGradient}
                delay={0}
                fontSize={50}
            />

            {/* Static Search Bar - Wrapped for reveal */}
            <RevealedBox delay={0.2}>
                <Paper
                    elevation={4}
                    sx={{
                        mb: 4,
                        p: 2,
                        background: darkThemeColors.cardBg,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(162, 155, 254, 0.1)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        maxWidth: '800px',
                        mx: 'auto',
                    }}
                >
                    <SearchIcon sx={{ color: darkThemeColors.accentPurple, mr: 2, fontSize: 24 }} />
                    <Typography variant="body1" sx={{ flexGrow: 1, color: darkThemeColors.textSecondary, textAlign: 'left' }}>
                        Search funds by name, AMC, or category...
                    </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{
                            background: 'linear-gradient(135deg, #00D2D3 0%, #7FEFEF 100%)',
                            color: darkThemeColors.background,
                            fontWeight: 700,
                            borderRadius: '10px',
                            p: '8px 16px',
                        }}
                    >
                        Smart Filters
                    </Button>
                </Paper>
            </RevealedBox>

            {/* Static Fund Cards Grid - Reveal Applied */}
            <Grid container spacing={4} maxWidth="1500px" mx="auto">
                {staticFundItems.map((item, index) => (
                    <Grid item xs={12} sm={6} key={item.id}>
                        <InvestmentCard
                            name={item.name}
                            category={item.category}
                            nav={item.nav}
                            y1r={item.y1r}
                            y3r={item.y3r}
                            color={item.color}
                            isActive={item.isActive}
                            delay={index * 0.1}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>

        {/*
          ===========================
          SECTION 5: SMART CALCULATORS (Reveal Applied)
          ===========================
        */}
        <Box sx={{ pt: 4, pb: 8, textAlign: 'center' }}>
            <HeaderSectionTitle 
                title="Smart Calculators" 
                subtitle="Plan your investments with precision using our interactive calculators"
                gradient={'linear-gradient(135deg, #00D2A0 0%, #FF6B9D 100%)'}
                delay={0}
                className="text-5xl"
            />

            <RevealedBox delay={0.2}>
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        background: darkThemeColors.cardBg,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(162, 155, 254, 0.1)',
                        borderRadius: '20px',
                        maxWidth: '1200px',
                        mx: 'auto',
                    }}
                >
                    {/* Calculator Tabs - Static UI Only */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 4, borderBottom: '1px solid #A9A7C730' }}>
                        <Button sx={{ 
                            color: darkThemeColors.accentTeal, 
                            fontWeight: 700, 
                            borderBottom: `2px solid ${darkThemeColors.accentTeal}`,
                            borderRadius: 0,
                            py: 1,
                        }}>
                            <TrendingUpIcon sx={{ mr: 1 }} /> SIP
                        </Button>
                        <Button sx={{ color: darkThemeColors.textSecondary, py: 1 }}>
                            <AccountBalanceWalletIcon sx={{ mr: 1 }} /> SWP
                        </Button>
                        <Button sx={{ color: darkThemeColors.textSecondary, py: 1 }}>
                            <AccountBalanceIcon sx={{ mr: 1 }} /> Lumpsum
                        </Button>
                        <Button sx={{ color: darkThemeColors.textSecondary, py: 1 }}>
                            <CalculateIcon sx={{ mr: 1 }} /> Step-up
                        </Button>
                    </Box>

                    {/* Static SIP Calculator Content */}
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ textAlign: 'left', mb: 2 }}>
                                <Typography variant="body1" sx={{ color: darkThemeColors.textSecondary, mb: 1 }}>
                                    Monthly Investment (₹)
                                </Typography>
                                <TextField
                                    fullWidth
                                    value="10000"
                                    disabled
                                    sx={{
                                        fieldset: { borderColor: darkThemeColors.accentPurple },
                                        input: {
                                            color: `${darkThemeColors.textPrimary} !important`,
                                            WebkitTextFillColor: `${darkThemeColors.textPrimary} !important`,
                                            opacity: 1
                                        }
                                    }}
                                />
                            </Box>
                            <Box sx={{ textAlign: 'left', mb: 2 }}>
                                <Typography variant="body1" sx={{ color: darkThemeColors.textSecondary, mb: 1 }}>
                                    Time Period (Years)
                                </Typography>
                                <TextField
                                    fullWidth
                                    value="10"
                                    disabled
                                    sx={{
                                        fieldset: { borderColor: darkThemeColors.accentPurple },
                                        input: {
                                            color: `${darkThemeColors.textPrimary} !important`,
                                            WebkitTextFillColor: `${darkThemeColors.textPrimary} !important`,
                                            opacity: 1
                                        }
                                    }}
                                />
                            </Box>
                            <Box sx={{ textAlign: 'left', mb: 2 }}>
                                <Typography variant="body1" sx={{ color: darkThemeColors.textSecondary, mb: 1 }}>
                                    Expected Return (%)
                                </Typography>
                                <TextField
                                    fullWidth
                                    value="12"
                                    disabled
                                    InputProps={{ endAdornment: <Typography sx={{ color: darkThemeColors.textSecondary }}>%</Typography> }}
                                    sx={{
                                        fieldset: { borderColor: darkThemeColors.accentPurple },
                                        input: {
                                            color: `${darkThemeColors.textPrimary} !important`,
                                            WebkitTextFillColor: `${darkThemeColors.textPrimary} !important`,
                                            opacity: 1
                                        }
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ p: 3, borderRadius: '16px', background: darkThemeColors.cardBg, border: `1px solid ${darkThemeColors.accentTeal}50`, mb: 2 }}>
                                <Typography variant="body2" sx={{ color: darkThemeColors.textSecondary, mb: 1 }}>Total Investment</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: darkThemeColors.textPrimary }}>₹12,00,000</Typography>
                            </Box>
                            <Box sx={{ p: 3, borderRadius: '16px', background: darkThemeColors.cardBg, border: `1px solid ${darkThemeColors.accentPurple}50`, boxShadow: `0 0 20px ${darkThemeColors.accentPurple}50`, mb: 2 }}>
                                <Typography variant="body2" sx={{ color: darkThemeColors.textSecondary, mb: 1 }}>Estimated Returns</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: darkThemeColors.accentRed }}>₹11,23,390.764</Typography>
                            </Box>
                            <Box sx={{ p: 3, borderRadius: '16px', background: darkThemeColors.cardBg, border: `1px solid ${darkThemeColors.accentRed}50`, boxShadow: `0 0 20px ${darkThemeColors.accentRed}50` }}>
                                <Typography variant="body2" sx={{ color: darkThemeColors.textSecondary, mb: 1 }}>Future Value</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: darkThemeColors.accentPurple }}>₹23,23,390.764</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    {/* Investment Growth Chart */}
                    <Box sx={{ mt: 4, height: 350, background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', border: `1px solid ${darkThemeColors.accentTeal}30`, p: 2 }}>
                      <svg width="100%" height="100%" viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg">
                        {/* Grid lines */}
                        <defs>
                          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Chart area */}
                        <rect x="40" y="20" width="520" height="220" fill="rgba(255,255,255,0.02)" rx="8" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>

                        {/* Investment growth line */}
                        <polyline
                          points="50,220 110,190 170,175 230,150 290,130 350,110 410,85 470,65 530,55"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Gradient definition */}
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{stopColor: darkThemeColors.accentTeal, stopOpacity: 1}} />
                            <stop offset="50%" style={{stopColor: darkThemeColors.accentPurple, stopOpacity: 1}} />
                            <stop offset="100%" style={{stopColor: darkThemeColors.accentRed, stopOpacity: 1}} />
                          </linearGradient>
                        </defs>

                        {/* Data points */}
                        <circle cx="50" cy="220" r="4" fill={darkThemeColors.accentTeal} opacity="0.8"/>
                        <circle cx="110" cy="190" r="4" fill={darkThemeColors.accentTeal} opacity="0.8"/>
                        <circle cx="170" cy="175" r="4" fill={darkThemeColors.accentPurple} opacity="0.8"/>
                        <circle cx="230" cy="150" r="4" fill={darkThemeColors.accentPurple} opacity="0.8"/>
                        <circle cx="290" cy="130" r="4" fill={darkThemeColors.accentPurple} opacity="0.8"/>
                        <circle cx="350" cy="110" r="4" fill={darkThemeColors.accentPurple} opacity="0.8"/>
                        <circle cx="410" cy="85" r="4" fill={darkThemeColors.accentRed} opacity="0.8"/>
                        <circle cx="470" cy="65" r="4" fill={darkThemeColors.accentRed} opacity="0.8"/>
                        <circle cx="530" cy="55" r="4" fill={darkThemeColors.accentRed} opacity="0.8"/>

                        {/* Y-axis labels */}
                        <text x="15" y="225" fill={darkThemeColors.textSecondary} fontSize="10" textAnchor="middle">0</text>
                        <text x="15" y="175" fill={darkThemeColors.textSecondary} fontSize="10" textAnchor="middle">5L</text>
                        <text x="15" y="125" fill={darkThemeColors.textSecondary} fontSize="10" textAnchor="middle">10L</text>
                        <text x="15" y="75" fill={darkThemeColors.textSecondary} fontSize="10" textAnchor="middle">15L</text>

                        {/* X-axis labels */}
                        <text x="50" y="245" fill={darkThemeColors.textSecondary} fontSize="9" textAnchor="middle">2024</text>
                        <text x="170" y="245" fill={darkThemeColors.textSecondary} fontSize="9" textAnchor="middle">2026</text>
                        <text x="290" y="245" fill={darkThemeColors.textSecondary} fontSize="9" textAnchor="middle">2028</text>
                        <text x="410" y="245" fill={darkThemeColors.textSecondary} fontSize="9" textAnchor="middle">2030</text>
                        <text x="530" y="245" fill={darkThemeColors.textSecondary} fontSize="9" textAnchor="middle">2032</text>

                        {/* Chart title */}
                        <text x="300" y="15" fill={darkThemeColors.textPrimary} fontSize="14" textAnchor="middle" fontWeight="600">
                          Investment Growth Projection
                        </text>
                      </svg>
                    </Box>
                </Paper>
            </RevealedBox>
        </Box>

        {/*
          ===========================
          SECTION 6: VALUE PROPOSITIONS (Reveal Applied)
          ===========================
        */}
        <Box sx={{ pt: 4, pb: 8, textAlign: 'center' }}>
          <Grid container spacing={4}>
            {valueProps.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  delay={index * 0.1}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

// Added these utility components back to simplify the main component logic
const HeaderSectionTitle = ({ title, subtitle, gradient, delay }) => {
    const { ref, isVisible } = useReveal({ threshold: 0.2 });
    return (
        <Box 
            ref={ref} 
            sx={{ 
                mb: 4, 
                textAlign: 'center',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
            }}
        >
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 800,
                    background: gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
                }}
            >
                {title}
            </Typography>
            <Typography variant="h6" sx={{ color: darkThemeColors.textSecondary, mb: 4 }}>
                {subtitle}
            </Typography>
        </Box>
    );
};

const RevealedBox = ({ children, delay }) => {
    const { ref, isVisible } = useReveal({ threshold: 0.1 });
    return (
        <Box 
            ref={ref} 
            sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
            }}
        >
            {children}
        </Box>
    );
}

export default Home;