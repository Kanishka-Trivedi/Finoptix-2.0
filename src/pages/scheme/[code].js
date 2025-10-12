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
} from '@mui/material';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import NAVChart from '../../components/NAVChart';
import ReturnsTable from '../../components/ReturnsTable';
import SIPCalculator from '../../components/SIPCalculator';
import SWPCalculator from '../../components/SWPCalculator';

export default function SchemeDetail() {
  const router = useRouter();
  const { code } = router.query;
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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

        {/* NAV Chart and Returns */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: 'rgba(255,255,255,0.9)',
                border: '2px solid rgba(184,164,217,0.2)',
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                NAV History (Last 1 Year)
              </Typography>
              <NAVChart navHistory={navHistory} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
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
          </Grid>
        </Grid>

        {/* Calculators */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <SIPCalculator schemeCode={code} navHistory={navHistory} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <SWPCalculator schemeCode={code} navHistory={navHistory} />
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
