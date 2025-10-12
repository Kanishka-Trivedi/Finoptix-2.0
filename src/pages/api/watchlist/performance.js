import axios from 'axios';
import { calculateReturns } from '../../../utils/calculations';

export default async function handler(req, res) {
  const { schemeCode } = req.query;

  if (!schemeCode) {
    return res.status(400).json({ error: 'schemeCode is required' });
  }

  try {
    // Fetch fund data from external API
    const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`, {
      timeout: 10000
    });

    const fundData = response.data;
    const navHistory = fundData.data || [];

    if (navHistory.length === 0) {
      return res.status(404).json({ error: 'No NAV data available' });
    }

    // Calculate returns for different periods
    const periods = ['1m', '3m', '6m', '1y'];
    const performance = {};

    for (const period of periods) {
      const result = calculateReturns(navHistory, period);
      if (!result.error) {
        performance[period] = {
          return: parseFloat(result.annualizedReturn),
          startNAV: result.startNAV,
          endNAV: result.endNAV
        };
      } else {
        performance[period] = {
          return: null,
          error: result.error
        };
      }
    }

    // Calculate 1-day return
    if (navHistory.length >= 2) {
      const latestNav = parseFloat(navHistory[0].nav);
      const previousNav = parseFloat(navHistory[1].nav);
      if (latestNav > 0 && previousNav > 0) {
        performance['1d'] = {
          return: ((latestNav - previousNav) / previousNav * 100).toFixed(2)
        };
      }
    }

    res.status(200).json({
      schemeCode,
      schemeName: fundData.meta?.scheme_name || 'Unknown',
      performance
    });

  } catch (error) {
    console.error('Performance API error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
