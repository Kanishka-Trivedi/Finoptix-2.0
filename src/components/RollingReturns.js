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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

export default function RollingReturns({ schemeCode, navHistory }) {
  const [formData, setFormData] = useState({
    period: '1y',
    from: '',
    to: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get default date range (last 5 years for rolling returns)
  const defaultDates = useMemo(() => {
    if (!navHistory || navHistory.length === 0) return { from: '', to: '' };

    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-');
      return new Date(year, month - 1, day);
    };

    const latestDate = parseDate(navHistory[0].date);
    const earliestDate = new Date(latestDate);
    earliestDate.setFullYear(earliestDate.getFullYear() - 5);

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
      const response = await fetch(`/api/scheme/${schemeCode}/rolling-returns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          period: formData.period,
          from: formData.from || defaultDates.from,
          to: formData.to || defaultDates.to,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || 'Failed to calculate Rolling Returns');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to calculate Rolling Returns. Please try again.');
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
            border: '2px solid #B8A4D9',
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
          <Typography variant="body2" color="primary">
            Return: {payload[0]?.value?.toFixed(2)}%
          </Typography>
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
        border: '2px solid rgba(184,164,217,0.2)',
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Rolling Returns Analysis
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Analyze returns across all possible investment periods to understand consistency
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Date range must be longer than the rolling period. 
          For 1-year rolling returns, select at least 2 years of data.
        </Typography>
      </Alert>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Rolling Period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            helperText="Period to analyze"
          >
            <MenuItem value="1m">1 Month</MenuItem>
            <MenuItem value="3m">3 Months</MenuItem>
            <MenuItem value="6m">6 Months</MenuItem>
            <MenuItem value="1y">1 Year</MenuItem>
            <MenuItem value="3y">3 Years</MenuItem>
            <MenuItem value="5y">5 Years</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Start Date"
            name="from"
            type="date"
            value={formData.from || defaultDates.from}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            helperText="Analysis start"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="End Date"
            name="to"
            type="date"
            value={formData.to || defaultDates.to}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            helperText="Analysis end"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <TimelineIcon />}
            onClick={handleCalculate}
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? 'Calculating...' : 'Calculate Rolling Returns'}
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
          
          {/* Statistics Summary */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(168,217,164,0.1)',
                  border: '1px solid rgba(168,217,164,0.3)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Best Return
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#88C785' }}>
                  {result.statistics.best}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(245,164,164,0.1)',
                  border: '1px solid rgba(245,164,164,0.3)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Worst Return
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#E88585' }}>
                  {result.statistics.worst}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(184,164,217,0.1)',
                  border: '1px solid rgba(184,164,217,0.3)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Average Return
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#B8A4D9' }}>
                  {result.statistics.average}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(164,217,196,0.1)',
                  border: '1px solid rgba(164,217,196,0.3)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Positive Periods
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#A4D9C4' }}>
                  {result.statistics.positivePercentage}%
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Chart */}
          {result.chartData && result.chartData.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Rolling Returns Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={result.chartData}>
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
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="return"
                    stroke="#B8A4D9"
                    strokeWidth={2}
                    dot={false}
                    name="Rolling Return"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Distribution Table */}
          {result.distribution && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Return Distribution
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Return Range</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Occurrences</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.distribution.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.range}</TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: row.percentage > 0 ? '#88C785' : 'text.secondary',
                            }}
                          >
                            {row.percentage}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}
