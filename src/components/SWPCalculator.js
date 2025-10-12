import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

export default function SWPCalculator({ schemeCode, navHistory }) {
  const [formData, setFormData] = useState({
    initialAmount: 100000,
    withdrawalAmount: 5000,
    frequency: 'monthly',
    from: '',
    to: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get default date range (last 3 years)
  const defaultDates = useMemo(() => {
    if (!navHistory || navHistory.length === 0) return { from: '', to: '' };

    // Parse the date string properly (format: "dd-MM-yyyy")
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-');
      return new Date(year, month - 1, day);
    };

    const latestDate = parseDate(navHistory[0].date);
    const earliestDate = new Date(latestDate);
    earliestDate.setFullYear(earliestDate.getFullYear() - 3);

    // Check if dates are valid
    if (isNaN(latestDate.getTime()) || isNaN(earliestDate.getTime())) {
      return { from: '', to: '' };
    }

    return {
      from: earliestDate.toISOString().split('T')[0],
      to: latestDate.toISOString().split('T')[0],
    };
  }, [navHistory]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/scheme/${schemeCode}/swp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initialAmount: parseFloat(formData.initialAmount),
          withdrawalAmount: parseFloat(formData.withdrawalAmount),
          frequency: formData.frequency,
          from: formData.from || defaultDates.from,
          to: formData.to || defaultDates.to,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || 'Failed to calculate SWP');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to calculate SWP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      return (
        <Box
          sx={{
            background: 'rgba(255,255,255,0.95)',
            border: '2px solid #A4D9C4',
            borderRadius: 2,
            p: 1.5,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {new Date(payload[0].payload.date).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </Typography>
          <Typography variant="body2" color="secondary">
            Balance: ₹{payload[0]?.value?.toLocaleString() || '0'}
          </Typography>
          {payload[1] && (
            <Typography variant="body2" color="primary">
              Withdrawn: ₹{payload[1]?.value?.toLocaleString() || '0'}
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        background: 'rgba(255,255,255,0.9)',
        border: '2px solid rgba(164,217,196,0.2)',
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        SWP Calculator
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Initial Investment"
            name="initialAmount"
            type="number"
            value={formData.initialAmount}
            onChange={handleChange}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Withdrawal Amount"
            name="withdrawalAmount"
            type="number"
            value={formData.withdrawalAmount}
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
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Start Date"
            name="from"
            type="date"
            value={formData.from || defaultDates.from}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="End Date"
            name="to"
            type="date"
            value={formData.to || defaultDates.to}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWalletIcon />}
            onClick={handleCalculate}
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? 'Calculating...' : 'Calculate SWP'}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 3 }} />
          
          {/* Results Summary */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(164,217,196,0.1) 0%, rgba(164,217,196,0.05) 100%)',
                  border: '1px solid rgba(164,217,196,0.3)',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Total Withdrawn
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#A4D9C4' }}>
                  ₹{result.totalWithdrawn.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, rgba(184,164,217,0.1) 0%, rgba(184,164,217,0.05) 100%)',
                  border: '1px solid rgba(184,164,217,0.3)',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Final Balance
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#B8A4D9' }}>
                  ₹{result.finalBalance.toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: parseFloat(result.absoluteReturn) >= 0
                    ? 'rgba(168,217,164,0.1)'
                    : 'rgba(245,164,164,0.1)',
                  border: parseFloat(result.absoluteReturn) >= 0
                    ? '1px solid rgba(168,217,164,0.3)'
                    : '1px solid rgba(245,164,164,0.3)',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Absolute Return
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: parseFloat(result.absoluteReturn) >= 0 ? '#88C785' : '#E88585',
                  }}
                >
                  {result.absoluteReturn}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: parseFloat(result.annualizedReturn) >= 0
                    ? 'rgba(168,217,164,0.1)'
                    : 'rgba(245,164,164,0.1)',
                  border: parseFloat(result.annualizedReturn) >= 0
                    ? '1px solid rgba(168,217,164,0.3)'
                    : '1px solid rgba(245,164,164,0.3)',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Annualized Return
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: parseFloat(result.annualizedReturn) >= 0 ? '#88C785' : '#E88585',
                  }}
                >
                  {result.annualizedReturn}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(245,212,164,0.1)',
                  border: '1px solid rgba(245,212,164,0.3)',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Remaining Units
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#F5D4A4' }}>
                  {result.remainingUnits}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Chart */}
          {result.chartData && result.chartData.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Balance Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={result.chartData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A4D9C4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A4D9C4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => {
                      const d = new Date(date);
                      return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    }}
                    stroke="#666"
                    style={{ fontSize: '11px' }}
                  />
                  <YAxis
                    stroke="#666"
                    style={{ fontSize: '11px' }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#A4D9C4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                    name="Balance"
                  />
                  <Line
                    type="monotone"
                    dataKey="withdrawn"
                    stroke="#B8A4D9"
                    strokeWidth={2}
                    dot={false}
                    name="Total Withdrawn"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}
