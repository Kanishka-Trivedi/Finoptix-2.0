import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';

const categoryColors = {
  Equity: '#B8A4D9',
  Debt: '#A4D9C4',
  Hybrid: '#F5D4A4',
  Liquid: '#A4C4F5',
  ELSS: '#F5A4A4',
  Index: '#D4A4F5',
  Gilt: '#A4F5D4',
  Other: '#D4D4D4',
};

function PerformanceCell({ schemeCode, period, label }) {
  const { data, error, isLoading } = useSWR(
    `/api/watchlist/performance?schemeCode=${schemeCode}`
  );

  if (isLoading) {
    return <CircularProgress size={16} />;
  }

  if (error || !data || !data.performance || !data.performance[period]) {
    return <Typography variant="body2">N/A</Typography>;
  }

  const returnValue = data.performance[period].return;

  if (returnValue === null || returnValue === undefined) {
    return <Typography variant="body2">N/A</Typography>;
  }

  const value = parseFloat(returnValue);
  const isPositive = value >= 0;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {isPositive ? (
        <TrendingUpIcon sx={{ fontSize: 16, color: '#88C785' }} />
      ) : (
        <TrendingDownIcon sx={{ fontSize: 16, color: '#E88585' }} />
      )}
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: isPositive ? '#88C785' : '#E88585',
        }}
      >
        {value.toFixed(2)}%
      </Typography>
    </Box>
  );
}

export default function Watchlist() {
  const router = useRouter();
  const [removing, setRemoving] = useState(null);

  const { data, error, isLoading } = useSWR('/api/watchlist');

  const handleRemove = async (schemeCode) => {
    if (!confirm('Remove this fund from watchlist?')) return;

    setRemoving(schemeCode);
    try {
      const response = await fetch(`/api/watchlist/${schemeCode}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutate('/api/watchlist');
      } else {
        alert('Failed to remove fund from watchlist');
      }
    } catch (err) {
      console.error('Error removing fund:', err);
      alert('Failed to remove fund from watchlist');
    } finally {
      setRemoving(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFFAF0 0%, #F0FFF0 50%, #FFF0F5 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/funds')}
            sx={{ mb: 2 }}
          >
            Back to Funds
          </Button>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #B8A4D9 0%, #A4D9C4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            My Watchlist
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track performance of your favorite mutual funds
          </Typography>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fund Details</TableCell>
                  <TableCell align="center">1 Day</TableCell>
                  <TableCell align="center">1 Month</TableCell>
                  <TableCell align="center">3 Months</TableCell>
                  <TableCell align="center">6 Months</TableCell>
                  <TableCell align="center">1 Year</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(3)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width={200} />
                    </TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error">
            Failed to load watchlist. Please try again later.
          </Alert>
        )}

        {/* Empty State */}
        {data && data.watchlist && data.watchlist.length === 0 && (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.9)',
            }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Your watchlist is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add funds to your watchlist to track their performance
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push('/funds')}
            >
              Browse Funds
            </Button>
          </Paper>
        )}

        {/* Watchlist Table */}
        {data && data.watchlist && data.watchlist.length > 0 && (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              background: 'rgba(255,255,255,0.9)',
              border: '2px solid rgba(184,164,217,0.2)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Fund Details</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>1 Day</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>1 Month</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>3 Months</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>6 Months</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>1 Year</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.watchlist.map((item) => (
                  <TableRow
                    key={item.schemeCode}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(184,164,217,0.05)',
                      },
                    }}
                  >
                    <TableCell onClick={() => router.push(`/scheme/${item.schemeCode}`)}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {item.schemeName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            {item.fundHouse}
                          </Typography>
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              background: categoryColors[item.category] || '#D4D4D4',
                              color: 'white',
                              fontWeight: 600,
                              height: 20,
                              fontSize: '0.7rem',
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <PerformanceCell schemeCode={item.schemeCode} period="1d" />
                    </TableCell>
                    <TableCell align="center">
                      <PerformanceCell schemeCode={item.schemeCode} period="1m" />
                    </TableCell>
                    <TableCell align="center">
                      <PerformanceCell schemeCode={item.schemeCode} period="3m" />
                    </TableCell>
                    <TableCell align="center">
                      <PerformanceCell schemeCode={item.schemeCode} period="6m" />
                    </TableCell>
                    <TableCell align="center">
                      <PerformanceCell schemeCode={item.schemeCode} period="1y" />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.schemeCode);
                        }}
                        disabled={removing === item.schemeCode}
                      >
                        {removing === item.schemeCode ? (
                          <CircularProgress size={24} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}
