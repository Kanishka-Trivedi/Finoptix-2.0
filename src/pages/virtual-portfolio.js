import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Skeleton,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

export default function VirtualPortfolio() {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    schemeCode: '',
    schemeName: '',
    amount: 5000,
    frequency: 'monthly',
    startDate: '',
    endDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { data, error: fetchError, isLoading } = useSWR('/api/virtual-portfolio');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/virtual-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        mutate('/api/virtual-portfolio');
        setOpenDialog(false);
        setFormData({
          schemeCode: '',
          schemeName: '',
          amount: 5000,
          frequency: 'monthly',
          startDate: '',
          endDate: '',
        });
      } else {
        setError(result.error || 'Failed to create virtual SIP');
      }
    } catch (err) {
      setError('Failed to create virtual SIP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this SIP from portfolio?')) return;

    try {
      const response = await fetch(`/api/virtual-portfolio/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        mutate('/api/virtual-portfolio');
      } else {
        alert('Failed to remove SIP');
      }
    } catch (err) {
      alert('Failed to remove SIP');
    }
  };

  // Prepare chart data
  const chartData = data?.portfolio?.map((item, index) => ({
    name: item.schemeName.substring(0, 20) + '...',
    invested: item.totalInvested || 0,
    current: item.currentValue || 0,
  })) || [];

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
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
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
              Virtual Portfolio
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Simulate and track your SIP investments
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ mt: 4 }}
          >
            Add SIP
          </Button>
        </Box>

        {/* Summary Cards */}
        {data && data.totals && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(184,164,217,0.1) 0%, rgba(184,164,217,0.05) 100%)',
                  border: '2px solid rgba(184,164,217,0.3)',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Total Invested
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#B8A4D9' }}>
                  ₹{data.totals.totalInvested.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(164,217,196,0.1) 0%, rgba(164,217,196,0.05) 100%)',
                  border: '2px solid rgba(164,217,196,0.3)',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Current Value
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#A4D9C4' }}>
                  ₹{data.totals.currentValue.toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: parseFloat(data.totals.totalReturn) >= 0
                    ? 'rgba(168,217,164,0.1)'
                    : 'rgba(245,164,164,0.1)',
                  border: parseFloat(data.totals.totalReturn) >= 0
                    ? '2px solid rgba(168,217,164,0.3)'
                    : '2px solid rgba(245,164,164,0.3)',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Total Return
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {parseFloat(data.totals.totalReturn) >= 0 ? (
                    <TrendingUpIcon sx={{ fontSize: 32, color: '#88C785' }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: 32, color: '#E88585' }} />
                  )}
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: parseFloat(data.totals.totalReturn) >= 0 ? '#88C785' : '#E88585',
                    }}
                  >
                    {data.totals.totalReturn}%
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Loading State */}
        {isLoading && (
          <Grid container spacing={3}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
                    <Skeleton variant="rectangular" height={100} sx={{ mt: 2, borderRadius: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Error State */}
        {fetchError && (
          <Alert severity="error">
            Failed to load portfolio. Please try again later.
          </Alert>
        )}

        {/* Empty State */}
        {data && data.portfolio && data.portfolio.length === 0 && (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.9)',
            }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Your portfolio is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create virtual SIPs to simulate your investments
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Add Your First SIP
            </Button>
          </Paper>
        )}

        {/* Portfolio Items */}
        {data && data.portfolio && data.portfolio.length > 0 && (
          <Grid container spacing={3}>
            {data.portfolio.map((item) => (
              <Grid item xs={12} md={6} key={item._id}>
                <Card
                  elevation={0}
                  sx={{
                    background: `linear-gradient(135deg, ${categoryColors[item.category] || '#D4D4D4'}15 0%, ${categoryColors[item.category] || '#D4D4D4'}05 100%)`,
                    border: `2px solid ${categoryColors[item.category] || '#D4D4D4'}30`,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {item.schemeName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              background: categoryColors[item.category] || '#D4D4D4',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                          <Chip
                            label={item.frequency}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(item._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          SIP Amount
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          ₹{item.amount.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Period
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.startDate} to {item.endDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Total Invested
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#B8A4D9' }}>
                          ₹{(item.totalInvested || 0).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Current Value
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#A4D9C4' }}>
                          ₹{(item.currentValue || 0).toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Absolute Return
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            color: (item.absoluteReturn || 0) >= 0 ? '#88C785' : '#E88585',
                          }}
                        >
                          {(item.absoluteReturn || 0).toFixed(2)}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Annualized Return
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 700,
                            color: (item.annualizedReturn || 0) >= 0 ? '#88C785' : '#E88585',
                          }}
                        >
                          {(item.annualizedReturn || 0).toFixed(2)}%
                        </Typography>
                      </Grid>
                    </Grid>

                    {item.error && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        {item.error}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add SIP Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Virtual SIP</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Scheme Code"
                    name="schemeCode"
                    value={formData.schemeCode}
                    onChange={handleChange}
                    helperText="Enter the mutual fund scheme code"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Scheme Name (Optional)"
                    name="schemeName"
                    value={formData.schemeName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SIP Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !formData.schemeCode || !formData.startDate || !formData.endDate}
            >
              {submitting ? <CircularProgress size={24} /> : 'Create SIP'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
