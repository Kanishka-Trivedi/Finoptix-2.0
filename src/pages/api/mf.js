import axios from 'axios';
import { cache } from '../../utils/cache';

const CACHE_KEY = 'all_schemes_from_api';
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours cache

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = 1, limit = 20, search = '', status = 'all' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Get all schemes from cache or fetch from API
    let allSchemes = cache.get(CACHE_KEY);

    if (!allSchemes) {
      console.log('Fetching schemes from external API...');
      const response = await axios.get('https://api.mfapi.in/mf', {
        timeout: 10000 // 10 second timeout
      });
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

        // Determine if scheme is active based on name patterns
        // Inactive schemes typically have keywords like "closed", "matured", "wound up"
        const isActive = !(
          nameLower.includes('closed') ||
          nameLower.includes('matured') ||
          nameLower.includes('wound up') ||
          nameLower.includes('merged') ||
          nameLower.includes('discontinued')
        );

        return {
          schemeCode: scheme.schemeCode,
          schemeName: name,
          fundHouse: fundHouse,
          category: category,
          isActive: isActive
        };
      });

      // Cache the processed data
      cache.set(CACHE_KEY, allSchemes, CACHE_TTL);
      console.log(`Cached ${allSchemes.length} schemes`);
    }

    // Filter by status (all, active, inactive)
    let filteredSchemes = allSchemes;
    if (status === 'active') {
      filteredSchemes = allSchemes.filter(scheme => scheme.isActive === true);
    } else if (status === 'inactive') {
      filteredSchemes = allSchemes.filter(scheme => scheme.isActive === false);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSchemes = filteredSchemes.filter(scheme =>
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
