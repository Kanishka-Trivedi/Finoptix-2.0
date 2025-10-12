import connectDB from '../../../lib/mongodb';
import Fund from '../../../models/Fund';
import { calculateReturns } from '../../../utils/calculations';

export default async function handler(req, res) {
  const { schemeCode } = req.query;

  if (!schemeCode) {
    return res.status(400).json({ error: 'schemeCode is required' });
  }

  try {
    await connectDB();

    const fund = await Fund.findOne({ schemeCode }).lean();

    if (!fund) {
      return res.status(404).json({ error: 'Fund not found' });
    }

    const navHistory = fund.navHistory || [];

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
      schemeName: fund.schemeName,
      performance
    });

  } catch (error) {
    console.error('Performance API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
