import axios from 'axios';
import connectDB from '../../lib/mongodb';
import Fund from '../../models/Fund';
import { cache } from '../../utils/cache';

const CACHE_KEY = 'all_active_schemes';
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = 1, limit = 20, search = '', activeOnly = 'true' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const filterActive = activeOnly === 'true';

    let allSchemes = cache.get(CACHE_KEY);

    // Try to get from MongoDB first
    if (!allSchemes) {
      try {
        await connectDB();
        
        const query = filterActive ? { isActive: true } : {};
        const fundsFromDB = await Fund.find(query)
          .select('schemeCode schemeName fundHouse category isActive latestNAV latestNAVDate')
          .lean();

        if (fundsFromDB && fundsFromDB.length > 0) {
          allSchemes = fundsFromDB.map(fund => ({
            schemeCode: fund.schemeCode,
            schemeName: fund.schemeName,
            fundHouse: fund.fundHouse,
            category: fund.category,
            isActive: fund.isActive,
            latestNAV: fund.latestNAV,
            latestNAVDate: fund.latestNAVDate
          }));
          
          cache.set(CACHE_KEY, allSchemes, CACHE_TTL);
        }
      } catch (dbError) {
        console.error('MongoDB error, falling back to API:', dbError.message);
      }
    }

    // Fallback to API if MongoDB is empty or unavailable
    if (!allSchemes || allSchemes.length === 0) {
      const response = await axios.get('https://api.mfapi.in/mf');
      allSchemes = response.data;

      // Process and enrich data
      allSchemes = allSchemes.map(scheme => {
        const name = scheme.schemeName || '';
        
        let fundHouse = 'Unknown';
        const parts = name.split('-');
        if (parts.length > 0) {
          fundHouse = parts[0].trim();
        }

        let category = 'Other';
        const nameLower = name.toLowerCase();
        if (nameLower.includes('equity') || nameLower.includes('stock')) {
          category = 'Equity';
        } else if (nameLower.includes('debt') || nameLower.includes('bond')) {
          category = 'Debt';
        } else if (nameLower.includes('hybrid') || nameLower.includes('balanced')) {
          category = 'Hybrid';
        } else if (nameLower.includes('liquid') || nameLower.includes('money market')) {
          category = 'Liquid';
        } else if (nameLower.includes('elss') || nameLower.includes('tax')) {
          category = 'ELSS';
        } else if (nameLower.includes('index') || nameLower.includes('etf')) {
          category = 'Index';
        } else if (nameLower.includes('gilt')) {
          category = 'Gilt';
        }

        return {
          schemeCode: scheme.schemeCode,
          schemeName: name,
          fundHouse: fundHouse,
          category: category,
          isActive: true // Assume active from API
        };
      });

      cache.set(CACHE_KEY, allSchemes, CACHE_TTL);
    }

    // Filter by search term
    let filteredSchemes = allSchemes;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSchemes = allSchemes.filter(scheme =>
        scheme.schemeName.toLowerCase().includes(searchLower) ||
        scheme.fundHouse.toLowerCase().includes(searchLower) ||
        scheme.category.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = filteredSchemes.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedSchemes = filteredSchemes.slice(startIndex, endIndex);

    res.status(200).json({
      schemes: paginatedSchemes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: total,
        totalPages: totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ error: 'Failed to fetch mutual fund schemes' });
  }
}
