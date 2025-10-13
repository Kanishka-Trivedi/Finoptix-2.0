import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  const { amount, stepUpPercentage, stepUpFrequency, frequency, from, to } = req.body;

  if (!amount || !stepUpPercentage || !stepUpFrequency || !frequency || !from || !to) {
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

    // Calculate frequency in days
    const frequencyDays = {
      monthly: 30,
      quarterly: 90,
    };

    const sipFrequencyDays = frequencyDays[frequency] || 30;

    // Calculate step-up frequency in days
    const stepUpFrequencyDays = {
      yearly: 365,
      'half-yearly': 182,
    };

    const stepUpDays = stepUpFrequencyDays[stepUpFrequency] || 365;

    // Perform Step-up SIP calculation
    let totalInvested = 0;
    let totalUnits = 0;
    let currentSIPAmount = amount;
    let lastInvestmentDate = parseDate(filteredNav[0].date);
    let lastStepUpDate = parseDate(filteredNav[0].date);
    const chartData = [];
    let investmentCount = 0;

    filteredNav.forEach((navItem) => {
      const currentDate = parseDate(navItem.date);
      const daysSinceLastInvestment = Math.floor((currentDate - lastInvestmentDate) / (1000 * 60 * 60 * 24));
      const daysSinceLastStepUp = Math.floor((currentDate - lastStepUpDate) / (1000 * 60 * 60 * 24));

      // Check if it's time for step-up
      if (daysSinceLastStepUp >= stepUpDays) {
        currentSIPAmount = currentSIPAmount * (1 + stepUpPercentage / 100);
        lastStepUpDate = currentDate;
      }

      // Check if it's time to invest
      if (daysSinceLastInvestment >= sipFrequencyDays || investmentCount === 0) {
        const nav = parseFloat(navItem.nav);
        const units = currentSIPAmount / nav;
        
        totalUnits += units;
        totalInvested += currentSIPAmount;
        lastInvestmentDate = currentDate;
        investmentCount++;
      }

      // Calculate current value
      const currentValue = totalUnits * parseFloat(navItem.nav);

      // Add to chart data (sample every 10th entry to reduce data size)
      if (chartData.length === 0 || chartData.length % 10 === 0) {
        chartData.push({
          date: currentDate.toISOString(),
          invested: Math.round(totalInvested),
          value: Math.round(currentValue),
        });
      }
    });

    // Final calculations
    const latestNav = parseFloat(filteredNav[filteredNav.length - 1].nav);
    const currentValue = totalUnits * latestNav;
    const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;
    
    // Calculate annualized return using XIRR approximation
    const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);
    const annualizedReturn = years > 0 
      ? (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100 
      : 0;

    // Add final data point
    chartData.push({
      date: endDate.toISOString(),
      invested: Math.round(totalInvested),
      value: Math.round(currentValue),
    });

    res.status(200).json({
      totalInvested: Math.round(totalInvested),
      currentValue: Math.round(currentValue),
      totalUnitsPurchased: totalUnits.toFixed(4),
      absoluteReturn: absoluteReturn.toFixed(2),
      annualizedReturn: annualizedReturn.toFixed(2),
      chartData: chartData,
      investmentCount: investmentCount,
      finalSIPAmount: Math.round(currentSIPAmount),
    });
  } catch (error) {
    console.error('Step-up SIP calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate Step-up SIP returns' });
  }
}
