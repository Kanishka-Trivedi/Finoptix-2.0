import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  const { amount, from, to } = req.body;

  if (!amount || !from || !to) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Fetch NAV history
    const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
    const navData = response.data.data;

    if (!navData || navData.length === 0) {
      return res.status(404).json({ error: 'No NAV data available' });
    }

    // Parse dates
    const parseDate = (dateStr) => {
      if (dateStr.includes('-') && dateStr.split('-')[0].length === 2) {
        // Format: dd-MM-yyyy
        const [day, month, year] = dateStr.split('-');
        return new Date(year, month - 1, day);
      } else {
        // Format: yyyy-MM-dd
        return new Date(dateStr);
      }
    };

    const startDate = parseDate(from);
    const endDate = parseDate(to);

    // Filter NAV data within date range
    const filteredNav = navData.filter((item) => {
      const itemDate = parseDate(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    }).reverse(); // Oldest first

    if (filteredNav.length === 0) {
      return res.status(400).json({ error: 'No NAV data available for the selected date range' });
    }

    // Get purchase NAV (first date)
    const purchaseNav = parseFloat(filteredNav[0].nav);
    const purchaseDate = parseDate(filteredNav[0].date);

    // Calculate units purchased
    const unitsPurchased = amount / purchaseNav;

    // Get current NAV (last date)
    const currentNav = parseFloat(filteredNav[filteredNav.length - 1].nav);
    const currentDate = parseDate(filteredNav[filteredNav.length - 1].date);

    // Calculate current value
    const currentValue = unitsPurchased * currentNav;

    // Calculate returns
    const absoluteReturn = ((currentValue - amount) / amount) * 100;

    // Calculate annualized return (CAGR)
    const years = (currentDate - purchaseDate) / (1000 * 60 * 60 * 24 * 365);
    const annualizedReturn = years > 0 
      ? (Math.pow(currentValue / amount, 1 / years) - 1) * 100 
      : 0;

    // Generate chart data (sample every 10th entry to reduce size)
    const chartData = [];
    filteredNav.forEach((navItem, index) => {
      if (index === 0 || index === filteredNav.length - 1 || index % 10 === 0) {
        const itemDate = parseDate(navItem.date);
        const itemNav = parseFloat(navItem.nav);
        const itemValue = unitsPurchased * itemNav;

        chartData.push({
          date: itemDate.toISOString(),
          value: Math.round(itemValue),
        });
      }
    });

    res.status(200).json({
      investedAmount: Math.round(amount),
      currentValue: Math.round(currentValue),
      unitsPurchased: unitsPurchased.toFixed(4),
      purchaseNAV: purchaseNav.toFixed(2),
      currentNAV: currentNav.toFixed(2),
      purchaseDate: filteredNav[0].date,
      currentDate: filteredNav[filteredNav.length - 1].date,
      absoluteReturn: absoluteReturn.toFixed(2),
      annualizedReturn: annualizedReturn.toFixed(2),
      chartData: chartData,
    });
  } catch (error) {
    console.error('Lumpsum calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate Lumpsum returns' });
  }
}
