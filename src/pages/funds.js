import { useState } from 'react';
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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import useSWR from 'swr';

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

export default function Funds() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const limit = 20;

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
    `/api/mf?page=${page}&limit=${limit}&search=${debouncedSearch}`
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (schemeCode) => {
    router.push(`/scheme/${schemeCode}`);
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
            Explore Mutual Funds
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Search and discover from thousands of mutual fund schemes
          </Typography>
        </Box>

        {/* Search Bar */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 2,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(184,164,217,0.2)',
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
                  <SearchIcon color="primary" />
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

        {/* Loading State */}
        {isLoading && (
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
                          background: `linear-gradient(135deg, ${categoryColors[scheme.category] || '#D4D4D4'}15 0%, ${categoryColors[scheme.category] || '#D4D4D4'}05 100%)`,
                          border: `2px solid ${categoryColors[scheme.category] || '#D4D4D4'}30`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 8px 24px ${categoryColors[scheme.category] || '#D4D4D4'}30`,
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
                            <Chip
                              label={scheme.category}
                              size="small"
                              sx={{
                                background: categoryColors[scheme.category] || '#D4D4D4',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
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
