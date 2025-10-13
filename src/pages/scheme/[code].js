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
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFFAF0 0%, #F0FFF0 50%, #FFF0F5 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/funds')}
          >
            Back to Funds
          </Button>
          <Button
            variant="contained"
            startIcon={addingToWatchlist ? <CircularProgress size={20} color="inherit" /> : <BookmarkAddIcon />}
            onClick={handleAddToWatchlist}
            disabled={addingToWatchlist}
          >
            Add to Watchlist
          </Button>
        </Box>

        {/* Scheme Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, rgba(184,164,217,0.1) 0%, rgba(164,217,196,0.1) 100%)',
            border: '2px solid rgba(184,164,217,0.3)',
          }}
        >
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
                }}
              />
            </Grid>
            <Grid item>
              <Chip
                label={metadata.schemeCategory}
                sx={{
                  background: '#A4D9C4',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            </Grid>
            <Grid item>
              <Chip
                label={metadata.schemeType}
                sx={{
                  background: '#F5D4A4',
                  color: 'white',
                  fontWeight: 600,
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

        {/* Main Content with Sidebar */}
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                background: 'rgba(255,255,255,0.9)',
                border: '2px solid rgba(184,164,217,0.2)',
                position: 'sticky',
                top: 20,
              }}
            >
              <List sx={{ p: 0 }}>
                {menuItems.map((item) => (
                  <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      selected={activeTab === item.id}
                      onClick={() => setActiveTab(item.id)}
                      sx={{
                        borderRadius: 2,
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, rgba(184,164,217,0.2) 0%, rgba(164,217,196,0.2) 100%)',
                          border: '2px solid rgba(184,164,217,0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, rgba(184,164,217,0.25) 0%, rgba(164,217,196,0.25) 100%)',
                          },
                        },
                        '&:hover': {
                          background: 'rgba(184,164,217,0.1)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: activeTab === item.id ? '#B8A4D9' : 'text.secondary',
                          minWidth: 40,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: activeTab === item.id ? 600 : 400,
                          color: activeTab === item.id ? 'text.primary' : 'text.secondary',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Content Area */}
          <Grid item xs={12} md={9}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <Box>
                {/* Price Statistics */}
                {stats && (
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, rgba(184,164,217,0.1) 0%, rgba(184,164,217,0.05) 100%)',
                          border: '2px solid rgba(184,164,217,0.3)',
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Latest NAV
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#B8A4D9', mb: 0.5 }}>
                          ₹{stats.latest}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stats.latestDate}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, rgba(168,217,164,0.1) 0%, rgba(168,217,164,0.05) 100%)',
                          border: '2px solid rgba(168,217,164,0.3)',
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Highest (1Y)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#88C785' }}>
                          ₹{stats.highest}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          background: 'linear-gradient(135deg, rgba(245,164,164,0.1) 0%, rgba(245,164,164,0.05) 100%)',
                          border: '2px solid rgba(245,164,164,0.3)',
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Lowest (1Y)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#E88585' }}>
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
                    background: 'rgba(255,255,255,0.9)',
                    border: '2px solid rgba(184,164,217,0.2)',
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
                    background: 'rgba(255,255,255,0.9)',
                    border: '2px solid rgba(164,217,196,0.2)',
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
                  background: 'rgba(255,255,255,0.9)',
                  border: '2px solid rgba(164,217,196,0.2)',
                }}
              >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Returns Analysis
                </Typography>
                <ReturnsTable schemeCode={code} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>

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
