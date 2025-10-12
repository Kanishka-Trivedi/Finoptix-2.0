import axios from 'axios';
import { cache } from '../../../utils/cache';

const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Scheme code is required' });
  }

  try {
    const cacheKey = `scheme_${code}`;
    let schemeData = cache.get(cacheKey);

    if (!schemeData) {
      // Fetch from API
      const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
      schemeData = response.data;

      // Cache the data
      cache.set(cacheKey, schemeData, CACHE_TTL);
    }

    // Extract metadata
    const metadata = {
      schemeCode: schemeData.meta?.scheme_code || code,
      schemeName: schemeData.meta?.scheme_name || 'Unknown',
      fundHouse: schemeData.meta?.fund_house || 'Unknown',
      schemeType: schemeData.meta?.scheme_type || 'Unknown',
      schemeCategory: schemeData.meta?.scheme_category || 'Unknown',
      isin: {
        growth: schemeData.meta?.scheme_isin_growth || null,
        dividend: schemeData.meta?.scheme_isin_div || null
      }
    };

    // Process NAV history
    const navHistory = (schemeData.data || []).map(item => ({
      date: item.date,
      nav: item.nav
    }));

    res.status(200).json({
      metadata: metadata,
      navHistory: navHistory
    });
  } catch (error) {
    console.error('Error fetching scheme details:', error);
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Scheme not found' });
    }
    
    res.status(500).json({ error: 'Failed to fetch scheme details' });
  }
}
