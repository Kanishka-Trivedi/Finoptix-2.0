import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  const { initialAmount, withdrawalAmount, stepUpPercentage, stepUpFrequency, frequency, from, to } = req.body;

  if (!initialAmount || !withdrawalAmount || !stepUpPercentage || !stepUpFrequency || !frequency || !from || !to) {
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

    const swpFrequencyDays = frequencyDays[frequency] || 30;

    // Calculate step-up frequency in days
    const stepUpFrequencyDays = {
      yearly: 365,
      'half-yearly': 182,
    };

    const stepUpDays = stepUpFrequencyDays[stepUpFrequency] || 365;

    // Initialize with initial investment
    const initialNav = parseFloat(filteredNav[0].nav);
    let totalUnits = initialAmount / initialNav;
    let totalWithdrawn = 0;
    let currentWithdrawalAmount = withdrawalAmount;
    let lastWithdrawalDate = parseDate(filteredNav[0].date);
    let lastStepUpDate = parseDate(filteredNav[0].date);
    const chartData = [];
    let withdrawalCount = 0;

    // Perform Step-up SWP calculation
    filteredNav.forEach((navItem) => {
      const currentDate = parseDate(navItem.date);
      const daysSinceLastWithdrawal = Math.floor((currentDate - lastWithdrawalDate) / (1000 * 60 * 60 * 24));
      const daysSinceLastStepUp = Math.floor((currentDate - lastStepUpDate) / (1000 * 60 * 60 * 24));

      // Check if it's time for step-up
      if (daysSinceLastStepUp >= stepUpDays && withdrawalCount > 0) {
        currentWithdrawalAmount = currentWithdrawalAmount * (1 + stepUpPercentage / 100);
        lastStepUpDate = currentDate;
      }

      // Check if it's time to withdraw
      if (daysSinceLastWithdrawal >= swpFrequencyDays && totalUnits > 0) {
        const nav = parseFloat(navItem.nav);
        const unitsToRedeem = currentWithdrawalAmount / nav;
        
        if (unitsToRedeem <= totalUnits) {
          totalUnits -= unitsToRedeem;
          totalWithdrawn += currentWithdrawalAmount;
          withdrawalCount++;
        } else if (totalUnits > 0) {
          // Partial withdrawal if not enough units
          const partialWithdrawal = totalUnits * nav;
          totalWithdrawn += partialWithdrawal;
          totalUnits = 0;
          withdrawalCount++;
        }
        
        lastWithdrawalDate = currentDate;
      }

      // Calculate current balance
      const currentBalance = totalUnits * parseFloat(navItem.nav);

      // Add to chart data (sample every 10th entry to reduce data size)
      if (chartData.length === 0 || chartData.length % 10 === 0) {
        chartData.push({
          date: currentDate.toISOString(),
          balance: Math.round(currentBalance),
          withdrawn: Math.round(totalWithdrawn),
        });
      }
    });

    // Final calculations
    const latestNav = parseFloat(filteredNav[filteredNav.length - 1].nav);
    const finalBalance = totalUnits * latestNav;
    const totalValue = totalWithdrawn + finalBalance;
    const absoluteReturn = ((totalValue - initialAmount) / initialAmount) * 100;
    
    // Calculate annualized return
    const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365);
    const annualizedReturn = years > 0 
      ? (Math.pow(totalValue / initialAmount, 1 / years) - 1) * 100 
      : 0;

    // Add final data point
    chartData.push({
      date: endDate.toISOString(),
      balance: Math.round(finalBalance),
      withdrawn: Math.round(totalWithdrawn),
    });

    res.status(200).json({
      totalWithdrawn: Math.round(totalWithdrawn),
      finalBalance: Math.round(finalBalance),
      remainingUnits: totalUnits.toFixed(4),
      absoluteReturn: absoluteReturn.toFixed(2),
      annualizedReturn: annualizedReturn.toFixed(2),
      chartData: chartData,
      withdrawalCount: withdrawalCount,
      finalWithdrawalAmount: Math.round(currentWithdrawalAmount),
    });
  } catch (error) {
    console.error('Step-up SWP calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate Step-up SWP returns' });
  }
}
