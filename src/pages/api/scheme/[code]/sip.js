import axios from 'axios';
import { cache } from '../../../../utils/cache';
import { calculateSIP } from '../../../../utils/calculations';

const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;
  const { amount, frequency, from, to } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Scheme code is required' });
  }

  if (!amount || !frequency || !from || !to) {
    return res.status(400).json({ 
      error: 'amount, frequency, from, and to are required' 
    });
  }

  if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
    return res.status(400).json({ 
      error: 'frequency must be daily, weekly, or monthly' 
    });
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

    // Calculate SIP
    const result = calculateSIP(
      navHistory,
      parseFloat(amount),
      frequency,
      from,
      to
    );

    if (result.error) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error calculating SIP:', error);
    res.status(500).json({ error: 'Failed to calculate SIP' });
  }
}
