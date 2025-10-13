import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  const { period, from, to } = req.body;

  if (!period || !from || !to) {
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

    // Calculate period in days
    const periodDays = {
      '1m': 30,
      '3m': 90,
      '6m': 180,
      '1y': 365,
      '3y': 1095,
      '5y': 1825,
    };

    const rollingPeriodDays = periodDays[period] || 365;

    // Check if we have enough data for the rolling period
    const dateRangeDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (dateRangeDays < rollingPeriodDays) {
      const periodLabel = {
        '1m': '1 month',
        '3m': '3 months',
        '6m': '6 months',
        '1y': '1 year',
        '3y': '3 years',
        '5y': '5 years',
      }[period] || period;
      
      return res.status(400).json({ 
        error: `Date range too short for ${periodLabel} rolling returns. Please select a date range longer than ${periodLabel}.` 
      });
    }

    // Calculate rolling returns
    const rollingReturns = [];
    
    // Start from the end and look backwards
    for (let i = filteredNav.length - 1; i >= 0; i--) {
      const currentDate = parseDate(filteredNav[i].date);
      const currentNav = parseFloat(filteredNav[i].nav);

      // Find NAV from rolling period ago (look backwards in array, which is forward in time)
      let startNav = null;
      let startNavDate = null;
      let closestDiff = Infinity;

      for (let j = 0; j < i; j++) {
        const checkDate = parseDate(filteredNav[j].date);
        const daysDiff = Math.floor((currentDate - checkDate) / (1000 * 60 * 60 * 24));

        // Look for NAV closest to the rolling period
        const diffFromTarget = Math.abs(daysDiff - rollingPeriodDays);
        
        if (daysDiff >= rollingPeriodDays - 15 && daysDiff <= rollingPeriodDays + 15) {
          if (diffFromTarget < closestDiff) {
            closestDiff = diffFromTarget;
            startNav = parseFloat(filteredNav[j].nav);
            startNavDate = checkDate;
          }
        }
      }

      // Calculate return if we have both NAVs
      if (startNav && startNavDate) {
        const years = (currentDate - startNavDate) / (1000 * 60 * 60 * 24 * 365);
        const absoluteReturn = ((currentNav - startNav) / startNav) * 100;
        const annualizedReturn = years > 0 
          ? (Math.pow(currentNav / startNav, 1 / years) - 1) * 100 
          : absoluteReturn;

        rollingReturns.push({
          date: currentDate.toISOString(),
          return: parseFloat(annualizedReturn.toFixed(2)),
          startDate: startNavDate.toISOString(),
          startNav: startNav,
          endNav: currentNav,
        });
      }
    }

    // Reverse to get chronological order
    rollingReturns.reverse();

    if (rollingReturns.length === 0) {
      return res.status(400).json({ 
        error: `Not enough data points for rolling returns calculation. Please select a longer date range or shorter rolling period.` 
      });
    }

    // Calculate statistics
    const returns = rollingReturns.map(r => r.return);
    const bestReturn = Math.max(...returns);
    const worstReturn = Math.min(...returns);
    const averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const positiveReturns = returns.filter(r => r >= 0).length;
    const positivePercentage = (positiveReturns / returns.length) * 100;

    // Calculate distribution
    const distribution = [
      { range: '> 20%', count: 0, percentage: 0 },
      { range: '15% to 20%', count: 0, percentage: 0 },
      { range: '10% to 15%', count: 0, percentage: 0 },
      { range: '5% to 10%', count: 0, percentage: 0 },
      { range: '0% to 5%', count: 0, percentage: 0 },
      { range: '-5% to 0%', count: 0, percentage: 0 },
      { range: '< -5%', count: 0, percentage: 0 },
    ];

    returns.forEach(ret => {
      if (ret > 20) distribution[0].count++;
      else if (ret > 15) distribution[1].count++;
      else if (ret > 10) distribution[2].count++;
      else if (ret > 5) distribution[3].count++;
      else if (ret > 0) distribution[4].count++;
      else if (ret > -5) distribution[5].count++;
      else distribution[6].count++;
    });

    distribution.forEach(item => {
      item.percentage = ((item.count / returns.length) * 100).toFixed(1);
    });

    // Sample chart data (every 5th entry to reduce size)
    const chartData = rollingReturns.filter((_, index) => 
      index === 0 || index === rollingReturns.length - 1 || index % 5 === 0
    );

    res.status(200).json({
      period: period,
      totalPeriods: rollingReturns.length,
      statistics: {
        best: bestReturn.toFixed(2),
        worst: worstReturn.toFixed(2),
        average: averageReturn.toFixed(2),
        positivePercentage: positivePercentage.toFixed(1),
      },
      distribution: distribution,
      chartData: chartData,
    });
  } catch (error) {
    console.error('Rolling returns calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate Rolling Returns' });
  }
}
