import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

export default function NAVChart({ navHistory }) {
  const chartData = useMemo(() => {
    if (!navHistory || navHistory.length === 0) return [];

    // Parse the date string properly (format: "dd-MM-yyyy")
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('-');
      return new Date(year, month - 1, day);
    };

    // Get last 1 year of data
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const filtered = navHistory
      .filter(item => {
        const date = parseDate(item.date);
        return !isNaN(date.getTime()) && date >= oneYearAgo && parseFloat(item.nav) > 0;
      })
      .reverse()
      .map(item => ({
        date: item.date,
        nav: parseFloat(item.nav),
      }));

    return filtered;
  }, [navHistory]);

  if (chartData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No NAV data available for the last year
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
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
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {(() => {
              const [day, month, year] = payload[0].payload.date.split('-');
              const date = new Date(year, month - 1, day);
              return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
            })()}
          </Typography>
          <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
            NAV: ₹{payload[0].value.toFixed(4)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          stroke="#666"
          style={{ fontSize: '12px' }}
        />
        <YAxis
          domain={['auto', 'auto']}
          stroke="#666"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `₹${value.toFixed(0)}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="nav"
          stroke="#B8A4D9"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, fill: '#B8A4D9' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
