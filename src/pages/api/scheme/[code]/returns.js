import axios from 'axios';
import { cache } from '../../../../utils/cache';
import { calculateReturns } from '../../../../utils/calculations';

const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  const { period, from, to } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Scheme code is required' });
  }

  if (!period && (!from || !to)) {
    return res.status(400).json({ error: 'Either period or from/to dates are required' });
  }

  try {
    // Get scheme data (with caching)
    const cacheKey = `scheme_${code}`;
    let schemeData = cache.get(cacheKey);

    if (!schemeData) {
      const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
      schemeData = response.data;
      cache.set(cacheKey, schemeData, CACHE_TTL);
    }

    const navHistory = schemeData.data || [];

    if (navHistory.length === 0) {
      return res.status(404).json({ error: 'No NAV data available' });
    }

    // Calculate returns
    const result = calculateReturns(navHistory, period, from, to);

    if (result.error) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error calculating returns:', error);
    res.status(500).json({ error: 'Failed to calculate returns' });
  }
}
