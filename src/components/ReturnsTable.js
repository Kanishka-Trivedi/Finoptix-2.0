import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import useSWR from 'swr';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export default function ReturnsTable({ schemeCode }) {
  const periods = ['1m', '3m', '6m', '1y'];

  const ReturnRow = ({ period, label }) => {
    const { data, error, isLoading } = useSWR(
      schemeCode ? `/api/scheme/${schemeCode}/returns?period=${period}` : null
    );

    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <CircularProgress size={16} />
        </Box>
      );
    }

    if (error || !data || data.error) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            N/A
          </Typography>
        </Box>
      );
    }

    const returnValue = parseFloat(data.annualizedReturn);
    const isPositive = returnValue >= 0;

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          p: 1.5,
          borderRadius: 2,
          background: isPositive
            ? 'rgba(168,217,164,0.1)'
            : 'rgba(245,164,164,0.1)',
          border: isPositive
            ? '1px solid rgba(168,217,164,0.3)'
            : '1px solid rgba(245,164,164,0.3)',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {isPositive ? (
            <TrendingUpIcon sx={{ fontSize: 18, color: '#88C785' }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 18, color: '#E88585' }} />
          )}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: isPositive ? '#88C785' : '#E88585',
            }}
          >
            {returnValue.toFixed(2)}%
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <ReturnRow period="1m" label="1 Month" />
      <ReturnRow period="3m" label="3 Months" />
      <ReturnRow period="6m" label="6 Months" />
      <ReturnRow period="1y" label="1 Year" />
    </Box>
  );
}
