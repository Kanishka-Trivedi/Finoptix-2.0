// Helper functions for financial calculations

export function findNearestNAV(navHistory, targetDate) {
  if (!navHistory || navHistory.length === 0) return null;
  
  const target = new Date(targetDate);
  let nearest = null;
  let minDiff = Infinity;
  
  for (const item of navHistory) {
    const navDate = new Date(item.date);
    if (navDate > target) continue; // Only consider dates before or equal to target
    
    const diff = target - navDate;
    if (diff < minDiff && parseFloat(item.nav) > 0) {
      minDiff = diff;
      nearest = item;
    }
  }
  
  return nearest;
}

export function calculateSIP(navHistory, amount, frequency, fromDate, toDate) {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  
  if (start >= end) {
    return { error: 'Start date must be before end date' };
  }
  
  let totalInvested = 0;
  let totalUnits = 0;
  const transactions = [];
  
  // Generate investment dates based on frequency
  const investmentDates = [];
  let currentDate = new Date(start);
  
  while (currentDate <= end) {
    investmentDates.push(new Date(currentDate));
    
    if (frequency === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (frequency === 'weekly') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else if (frequency === 'daily') {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  // Process each investment
  for (const date of investmentDates) {
    const navData = findNearestNAV(navHistory, date);
    
    if (!navData) continue;
    
    const nav = parseFloat(navData.nav);
    if (nav <= 0) continue;
    
    const units = amount / nav;
    totalUnits += units;
    totalInvested += amount;
    
    transactions.push({
      date: date.toISOString().split('T')[0],
      nav: nav,
      amount: amount,
      units: units,
      totalUnits: totalUnits,
      invested: totalInvested
    });
  }
  
  if (transactions.length === 0) {
    return { error: 'Insufficient NAV data for the selected period', needs_review: true };
  }
  
  // Calculate final value
  const finalNavData = findNearestNAV(navHistory, end);
  if (!finalNavData) {
    return { error: 'Cannot find final NAV', needs_review: true };
  }
  
  const finalNav = parseFloat(finalNavData.nav);
  const currentValue = totalUnits * finalNav;
  const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;
  
  // Calculate annualized return
  const years = (end - start) / (365.25 * 24 * 60 * 60 * 1000);
  const annualizedReturn = years > 0 
    ? (Math.pow(currentValue / totalInvested, 1 / years) - 1) * 100 
    : 0;
  
  // Generate chart data
  const chartData = transactions.map(t => ({
    date: t.date,
    invested: Math.round(t.invested),
    value: Math.round(t.totalUnits * finalNav)
  }));
  
  return {
    totalInvested: Math.round(totalInvested),
    currentValue: Math.round(currentValue),
    totalUnitsPurchased: totalUnits.toFixed(4),
    absoluteReturn: absoluteReturn.toFixed(2),
    annualizedReturn: annualizedReturn.toFixed(2),
    transactions: transactions,
    chartData: chartData,
    finalNav: finalNav
  };
}

export function calculateSWP(navHistory, initialAmount, withdrawalAmount, frequency, fromDate, toDate) {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  
  if (start >= end) {
    return { error: 'Start date must be before end date' };
  }
  
  // Get initial NAV
  const initialNavData = findNearestNAV(navHistory, start);
  if (!initialNavData) {
    return { error: 'Cannot find initial NAV', needs_review: true };
  }
  
  const initialNav = parseFloat(initialNavData.nav);
  if (initialNav <= 0) {
    return { error: 'Invalid initial NAV', needs_review: true };
  }
  
  let units = initialAmount / initialNav;
  let totalWithdrawn = 0;
  const transactions = [];
  
  // Generate withdrawal dates
  const withdrawalDates = [];
  let currentDate = new Date(start);
  
  while (currentDate <= end) {
    withdrawalDates.push(new Date(currentDate));
    
    if (frequency === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else if (frequency === 'weekly') {
      currentDate.setDate(currentDate.getDate() + 7);
    } else if (frequency === 'quarterly') {
      currentDate.setMonth(currentDate.getMonth() + 3);
    }
  }
  
  // Process each withdrawal
  for (const date of withdrawalDates) {
    const navData = findNearestNAV(navHistory, date);
    
    if (!navData) continue;
    
    const nav = parseFloat(navData.nav);
    if (nav <= 0) continue;
    
    const currentValue = units * nav;
    
    if (currentValue < withdrawalAmount) {
      // Insufficient balance
      transactions.push({
        date: date.toISOString().split('T')[0],
        nav: nav,
        withdrawn: currentValue,
        units: units,
        remainingUnits: 0,
        balance: 0
      });
      totalWithdrawn += currentValue;
      units = 0;
      break;
    }
    
    const unitsToRedeem = withdrawalAmount / nav;
    units -= unitsToRedeem;
    totalWithdrawn += withdrawalAmount;
    
    transactions.push({
      date: date.toISOString().split('T')[0],
      nav: nav,
      withdrawn: withdrawalAmount,
      unitsRedeemed: unitsToRedeem,
      remainingUnits: units,
      balance: units * nav
    });
  }
  
  if (transactions.length === 0) {
    return { error: 'Insufficient NAV data for the selected period', needs_review: true };
  }
  
  // Calculate final balance
  const finalNavData = findNearestNAV(navHistory, end);
  if (!finalNavData) {
    return { error: 'Cannot find final NAV', needs_review: true };
  }
  
  const finalNav = parseFloat(finalNavData.nav);
  const finalBalance = units * finalNav;
  
  const netAmount = finalBalance + totalWithdrawn - initialAmount;
  const absoluteReturn = (netAmount / initialAmount) * 100;
  
  // Calculate annualized return
  const years = (end - start) / (365.25 * 24 * 60 * 60 * 1000);
  const totalValue = finalBalance + totalWithdrawn;
  const annualizedReturn = years > 0 
    ? (Math.pow(totalValue / initialAmount, 1 / years) - 1) * 100 
    : 0;
  
  // Generate chart data
  const chartData = transactions.map(t => ({
    date: t.date,
    balance: Math.round(t.balance),
    withdrawn: Math.round(totalWithdrawn)
  }));
  
  return {
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(finalBalance),
    remainingUnits: units.toFixed(4),
    absoluteReturn: absoluteReturn.toFixed(2),
    annualizedReturn: annualizedReturn.toFixed(2),
    transactions: transactions,
    chartData: chartData,
    finalNav: finalNav
  };
}

export function calculateReturns(navHistory, period, fromDate, toDate) {
  let startDate, endDate;
  
  if (period) {
    endDate = new Date();
    startDate = new Date();
    
    switch (period) {
      case '1m':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case '3y':
        startDate.setFullYear(startDate.getFullYear() - 3);
        break;
      case '5y':
        startDate.setFullYear(startDate.getFullYear() - 5);
        break;
      default:
        return { error: 'Invalid period' };
    }
  } else if (fromDate && toDate) {
    startDate = new Date(fromDate);
    endDate = new Date(toDate);
  } else {
    return { error: 'Either period or from/to dates required' };
  }
  
  const startNavData = findNearestNAV(navHistory, startDate);
  const endNavData = findNearestNAV(navHistory, endDate);
  
  if (!startNavData || !endNavData) {
    return { error: 'Insufficient data for calculation', needs_review: true };
  }
  
  const startNav = parseFloat(startNavData.nav);
  const endNav = parseFloat(endNavData.nav);
  
  if (startNav <= 0 || endNav <= 0) {
    return { error: 'Invalid NAV values', needs_review: true };
  }
  
  const simpleReturn = ((endNav - startNav) / startNav) * 100;
  
  // Calculate annualized return
  const years = (new Date(endNavData.date) - new Date(startNavData.date)) / (365.25 * 24 * 60 * 60 * 1000);
  const annualizedReturn = years > 0 
    ? (Math.pow(endNav / startNav, 1 / years) - 1) * 100 
    : simpleReturn;
  
  return {
    startDate: startNavData.date,
    endDate: endNavData.date,
    startNAV: startNav.toFixed(4),
    endNAV: endNav.toFixed(4),
    simpleReturn: simpleReturn.toFixed(2),
    annualizedReturn: annualizedReturn.toFixed(2)
  };
}
