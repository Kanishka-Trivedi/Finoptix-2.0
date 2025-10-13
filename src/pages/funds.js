import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Pagination,
  CircularProgress,
  InputAdornment,
  Paper,
  Skeleton,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import BlobBackground from '../components/BlobBackground';

const categoryColors = {
  Equity: '#6C5CE7',
  Debt: '#00D2D3',
  Hybrid: '#A29BFE',
  Liquid: '#00D2A0',
  ELSS: '#FF6B9D',
  Index: '#FFB800',
  Gilt: '#7FEFEF',
  Other: '#636E72',
};

export default function Funds() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
  const limit = 100; // Show 100 schemes per page

  // Initialize filter from URL query params or localStorage on mount
  useEffect(() => {
    const urlStatus = router.query.status;
    const savedStatus = localStorage.getItem('fundsStatusFilter');
    
    if (urlStatus && ['all', 'active', 'inactive'].includes(urlStatus)) {
      setStatusFilter(urlStatus);
    } else if (savedStatus && ['all', 'active', 'inactive'].includes(savedStatus)) {
      setStatusFilter(savedStatus);
      // Update URL to reflect the saved filter
      router.replace({ pathname: '/funds', query: { status: savedStatus } }, undefined, { shallow: true });
    }
  }, []);

  // Save filter to localStorage and URL whenever it changes
  useEffect(() => {
    if (statusFilter) {
      localStorage.setItem('fundsStatusFilter', statusFilter);
      // Update URL query params
      router.replace({ pathname: '/funds', query: { status: statusFilter } }, undefined, { shallow: true });
    }
  }, [statusFilter]);

  // Debounce search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    // Reset to page 1 on search
    setPage(1);
    
    // Debounce the API call
    setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);
  };

  const { data, error, isLoading } = useSWR(
    `/api/mf?page=${page}&limit=${limit}&search=${debouncedSearch}&status=${statusFilter}`
  );

  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      setStatusFilter(newStatus);
      setPage(1); // Reset to page 1 when filter changes
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (schemeCode) => {
    // Navigate to scheme details page
    router.push(`/scheme/${schemeCode}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E8E4F3 0%, #F5F3FF 50%, #E8E4F3 100%)',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BlobBackground variant="default" />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Explore Mutual Funds
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Search and discover from thousands of mutual fund schemes
          </Typography>
        </Box>

        {/* Status Filter */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(108, 92, 231, 0.15)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            Filter:
          </Typography>
          <ToggleButtonGroup
            value={statusFilter}
            exclusive
            onChange={handleStatusChange}
            aria-label="fund status filter"
            sx={{
              '& .MuiToggleButton-root': {
                px: 3,
                py: 1,
                border: '2px solid rgba(108, 92, 231, 0.2)',
                borderRadius: '12px',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                  color: 'white',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(108, 92, 231, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5F4FD1 0%, #8B82E8 100%)',
                  },
                },
              },
            }}
          >
            <ToggleButton value="all" aria-label="all funds">
              <AllInclusiveIcon sx={{ mr: 1, fontSize: 20 }} />
              All
            </ToggleButton>
            <ToggleButton value="active" aria-label="active funds">
              <CheckCircleIcon sx={{ mr: 1, fontSize: 20 }} />
              Active
            </ToggleButton>
            <ToggleButton value="inactive" aria-label="inactive funds">
              <CancelIcon sx={{ mr: 1, fontSize: 20 }} />
              Inactive
            </ToggleButton>
          </ToggleButtonGroup>
        </Paper>

        {/* Search Bar */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(108, 92, 231, 0.15)',
            borderRadius: '24px',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search by fund name, fund house, or category..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6C5CE7' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'white',
              },
            }}
          />
        </Paper>

        {/* Indexing State */}
        {data?.indexing && (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.9)',
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Building Fund Status Index
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We're analyzing funds to determine their active/inactive status.
              This happens once per day and takes a few minutes.
              Please check back shortly or switch to "All" filter.
            </Typography>
          </Paper>
        )}

        {/* Loading State */}
        {isLoading && !data?.indexing && (
          <Grid container spacing={3}>
            {[...Array(limit)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
                    <Skeleton variant="rectangular" width={80} height={24} sx={{ mt: 2, borderRadius: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Error State */}
        {error && (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              background: 'rgba(245,164,164,0.1)',
              border: '2px solid rgba(245,164,164,0.3)',
            }}
          >
            <Typography variant="h6" color="error">
              Failed to load funds
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please try again later
            </Typography>
          </Paper>
        )}

        {/* Funds Grid */}
        {data && !isLoading && (
          <>
            {data.schemes.length === 0 ? (
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.9)',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No funds found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search criteria
                </Typography>
              </Paper>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Showing {data.schemes.length} of {data.pagination.total} funds
                </Typography>
                <Grid container spacing={3}>
                  {data.schemes.map((scheme) => (
                    <Grid item xs={12} sm={6} md={4} key={scheme.schemeCode}>
                      <Card
                        elevation={0}
                        sx={{
                          height: '100%',
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: `2px solid ${categoryColors[scheme.category] || '#636E72'}30`,
                          borderRadius: '24px',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 12px 32px ${categoryColors[scheme.category] || '#636E72'}40`,
                          },
                        }}
                      >
                        <CardActionArea
                          onClick={() => handleCardClick(scheme.schemeCode)}
                          sx={{ height: '100%', p: 2 }}
                        >
                          <CardContent>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                mb: 1,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                minHeight: '3.6em',
                              }}
                            >
                              {scheme.schemeName}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              {scheme.fundHouse}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip
                                label={scheme.category}
                                size="small"
                                sx={{
                                  background: `linear-gradient(135deg, ${categoryColors[scheme.category] || '#636E72'} 0%, ${categoryColors[scheme.category] || '#636E72'}DD 100%)`,
                                  color: 'white',
                                  fontWeight: 600,
                                  borderRadius: '12px',
                                  boxShadow: `0 2px 8px ${categoryColors[scheme.category] || '#636E72'}40`,
                                }}
                              />
                              <Chip
                                icon={scheme.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                                label={scheme.isActive ? 'Active' : 'Inactive'}
                                size="small"
                                sx={{
                                  background: scheme.isActive ? '#88C785' : '#E88585',
                                  color: 'white',
                                  fontWeight: 600,
                                  '& .MuiChip-icon': {
                                    color: 'white',
                                  },
                                }}
                              />
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {data.pagination.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={data.pagination.totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
