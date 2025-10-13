import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Skeleton,
  Divider,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TimelineIcon from '@mui/icons-material/Timeline';
import NAVChart from '../../components/NAVChart';
import ReturnsTable from '../../components/ReturnsTable';
import SIPCalculator from '../../components/SIPCalculator';
import SWPCalculator from '../../components/SWPCalculator';
import StepUpSIPCalculator from '../../components/StepUpSIPCalculator';
import StepUpSWPCalculator from '../../components/StepUpSWPCalculator';
import LumpsumCalculator from '../../components/LumpsumCalculator';
import RollingReturns from '../../components/RollingReturns';
import BlobBackground from '../../components/BlobBackground';

export default function SchemeDetail() {
  const router = useRouter();
  const { code } = router.query;
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState('overview');

  const { data, error, isLoading } = useSWR(
    code ? `/api/scheme/${code}` : null
  );

  const handleAddToWatchlist = async () => {
    setAddingToWatchlist(true);
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          schemeCode: code,
          schemeName: data?.meta?.scheme_name || data?.schemeName || 'Unknown'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({ open: true, message: 'Added to watchlist!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to add to watchlist', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to add to watchlist', severity: 'error' });
    } finally {
      setAddingToWatchlist(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #FFFAF0 0%, #F0FFF0 50%, #FFF0F5 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" width={120} height={40} sx={{ mb: 3, borderRadius: 2 }} />
          <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="40%" height={30} sx={{ mb: 4 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #FFFAF0 0%, #F0FFF0 50%, #FFF0F5 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/funds')}
            sx={{ mb: 3 }}
          >
            Back to Funds
          </Button>
          <Alert severity="error">
            Failed to load scheme details. Please try again later.
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #FFFAF0 0%, #F0FFF0 50%, #FFF0F5 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/funds')}
            sx={{ mb: 3 }}
          >
            Back to Funds
          </Button>
          <Alert severity="error">
            No data available for this scheme.
          </Alert>
        </Container>
      </Box>
    );
  }

  const { metadata, navHistory } = data;

  // Calculate price statistics
  const calculateStats = () => {
    if (!navHistory || navHistory.length === 0) return null;
    
    const navValues = navHistory.map(item => parseFloat(item.nav));
    const latestNAV = navValues[0];
    const highestNAV = Math.max(...navValues);
    const lowestNAV = Math.min(...navValues);
    
    return {
      latest: latestNAV.toFixed(2),
      highest: highestNAV.toFixed(2),
      lowest: lowestNAV.toFixed(2),
      latestDate: navHistory[0].date
    };
  };

  const stats = calculateStats();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <TrendingUpIcon /> },
    { id: 'sip', label: 'SIP Calculator', icon: <CalculateIcon /> },
    { id: 'lumpsum', label: 'Lumpsum', icon: <AccountBalanceIcon /> },
    { id: 'swp', label: 'SWP Calculator', icon: <AccountBalanceWalletIcon /> },
    { id: 'stepup-sip', label: 'Step-up SIP', icon: <ShowChartIcon /> },
    { id: 'stepup-swp', label: 'Step-up SWP', icon: <TrendingDownIcon /> },
    { id: 'rolling-returns', label: 'Rolling Returns', icon: <TimelineIcon /> },
    { id: 'returns', label: 'Returns', icon: <BarChartIcon /> },
  ];

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #E8E4F3 0%, #F5F3FF 50%, #E8E4F3 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
      }}
    >
      <BlobBackground variant="default" />

      {/* Fixed Sidebar */}
      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: { xs: '100%', md: '300px' },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderRadius: '0',
          p: 2.5,
          zIndex: 1000,
          overflowY: 'auto',
        }}
      >
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                sx={{
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  py: 1.5,
                  px: 2,
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(108, 92, 231, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5F4FD1 0%, #8B82E8 100%)',
                      boxShadow: '0 12px 32px rgba(108, 92, 231, 0.4)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(108, 92, 231, 0.08)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: activeTab === item.id ? 'white' : '#6C5CE7',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: activeTab === item.id ? 600 : 500,
                    color: activeTab === item.id ? 'white' : 'text.primary',
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Fixed Header */}
      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          top: 0,
          left: { xs: 0, md: '300px' },
          right: 0,
          height: '70px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(108, 92, 231, 0.15)',
          borderRadius: '0',
          p: 2,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/funds')}
          sx={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(108, 92, 231, 0.2)',
            color: '#6C5CE7',
            borderRadius: '8px',
            py: 1,
            px: 2,
            fontSize: '0.9rem',
            '&:hover': {
              background: 'rgba(255, 255, 255, 1)',
              border: '2px solid rgba(108, 92, 231, 0.4)',
            },
          }}
        >
          Back to Funds
        </Button>
        <Button
          variant="contained"
          startIcon={addingToWatchlist ? <CircularProgress size={20} color="inherit" /> : <BookmarkAddIcon />}
          onClick={handleAddToWatchlist}
          disabled={addingToWatchlist}
          sx={{
            background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
            boxShadow: '0 8px 24px rgba(108, 92, 231, 0.3)',
            borderRadius: '8px',
            py: 1,
            px: 2,
            fontSize: '0.9rem',
            '&:hover': {
              background: 'linear-gradient(135deg, #5F4FD1 0%, #8B82E8 100%)',
              boxShadow: '0 12px 32px rgba(108, 92, 231, 0.4)',
            },
          }}
        >
          Add to Watchlist
        </Button>
      </Paper>

      {/* Main Content Area */}
      <Box
        sx={{
          position: 'fixed',
          top: '70px',
          left: { xs: 0, md: '300px' },
          right: 0,
          bottom: 0,
          overflow: 'auto',
          p: 2.5,
        }}
      >
        {/* Scheme Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3.5,
            mb: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(108, 92, 231, 0.15)',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <BlobBackground variant="card" />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
            }}
          >
            {metadata.schemeName}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item>
              <Chip
                label={metadata.fundHouse}
                sx={{
                  background: '#B8A4D9',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '8px',
                }}
              />
            </Grid>
            <Grid item>
              <Chip
                label={metadata.schemeCategory}
                sx={{
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(108, 92, 231, 0.25)',
                }}
              />
            </Grid>
            <Grid item>
              <Chip
                label={metadata.schemeType}
                sx={{
                  background: 'linear-gradient(135deg, #00D2D3 0%, #7FEFEF 100%)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 210, 211, 0.25)',
                }}
              />
            </Grid>
          </Grid>
          {(metadata.isin.growth || metadata.isin.dividend) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {metadata.isin.growth && `ISIN (Growth): ${metadata.isin.growth}`}
                {metadata.isin.growth && metadata.isin.dividend && ' | '}
                {metadata.isin.dividend && `ISIN (Dividend): ${metadata.isin.dividend}`}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <Box>
            {/* Price Statistics */}
            {stats && (
              <Grid container spacing={2.5} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(108, 92, 231, 0.15)',
                      borderRadius: '12px',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(108, 92, 231, 0.2)',
                      },
                    }}
                  >
                    <BlobBackground variant="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, position: 'relative', zIndex: 1 }}>
                      Latest NAV
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#6C5CE7', mb: 0.5, position: 'relative', zIndex: 1 }}>
                      ₹{stats.latest}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ position: 'relative', zIndex: 1 }}>
                      {stats.latestDate}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(0, 210, 160, 0.15)',
                      borderRadius: '12px',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(0, 210, 160, 0.2)',
                      },
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Highest (1Y)
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#00D2A0' }}>
                      ₹{stats.highest}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 107, 157, 0.15)',
                      borderRadius: '12px',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      height: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 32px rgba(255, 107, 157, 0.2)',
                      },
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Lowest (1Y)
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF6B9D' }}>
                      ₹{stats.lowest}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* NAV Chart */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(108, 92, 231, 0.15)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                NAV History (Last 1 Year)
              </Typography>
              <NAVChart navHistory={navHistory} />
            </Paper>

            {/* Returns */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(108, 92, 231, 0.15)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Returns
              </Typography>
              <ReturnsTable schemeCode={code} />
            </Paper>
          </Box>
        )}

        {/* SIP Calculator Tab */}
        {activeTab === 'sip' && (
          <SIPCalculator schemeCode={code} navHistory={navHistory} />
        )}

        {/* Lumpsum Calculator Tab */}
        {activeTab === 'lumpsum' && (
          <LumpsumCalculator schemeCode={code} navHistory={navHistory} />
        )}

        {/* SWP Calculator Tab */}
        {activeTab === 'swp' && (
          <SWPCalculator schemeCode={code} navHistory={navHistory} />
        )}

        {/* Step-up SIP Calculator Tab */}
        {activeTab === 'stepup-sip' && (
          <StepUpSIPCalculator schemeCode={code} navHistory={navHistory} />
        )}

        {/* Step-up SWP Calculator Tab */}
        {activeTab === 'stepup-swp' && (
          <StepUpSWPCalculator schemeCode={code} navHistory={navHistory} />
        )}

        {/* Rolling Returns Tab */}
        {activeTab === 'rolling-returns' && (
          <RollingReturns schemeCode={code} navHistory={navHistory} />
        )}

        {/* Returns Tab */}
        {activeTab === 'returns' && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(108, 92, 231, 0.15)',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Returns Analysis
            </Typography>
            <ReturnsTable schemeCode={code} />
          </Paper>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}
