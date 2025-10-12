import axios from 'axios';
import connectDB from '../../../lib/mongodb';
import Watchlist from '../../../models/Watchlist';

export default async function handler(req, res) {
  const userId = 'default-user'; // In production, get from session/auth

  try {
    console.log('[WATCHLIST API] Request method:', req.method);
    await connectDB();
    console.log('[WATCHLIST API] MongoDB connected');

    if (req.method === 'GET') {
      // Get user's watchlist with fund details
      const watchlistItems = await Watchlist.find({ userId })
        .sort({ addedDate: -1 })
        .lean();

      if (watchlistItems.length === 0) {
        return res.status(200).json({ watchlist: [] });
      }

      // Fetch fund details from external API for each watchlist item
      const watchlist = await Promise.all(
        watchlistItems.map(async (item) => {
          try {
            const response = await axios.get(`https://api.mfapi.in/mf/${item.schemeCode}`, {
              timeout: 5000
            });
            const fundData = response.data;
            const navHistory = fundData.data || [];
            
            // Extract fund details
            const name = fundData.meta?.scheme_name || item.schemeName || 'Unknown';
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
            }

            return {
              _id: item._id,
              schemeCode: item.schemeCode,
              addedDate: item.addedDate,
              schemeName: name,
              fundHouse: fundHouse,
              category: category,
              latestNAV: navHistory.length > 0 ? navHistory[0].nav : null,
              latestNAVDate: navHistory.length > 0 ? navHistory[0].date : null,
              isActive: true
            };
          } catch (error) {
            console.error(`Error fetching fund ${item.schemeCode}:`, error.message);
            return {
              _id: item._id,
              schemeCode: item.schemeCode,
              addedDate: item.addedDate,
              schemeName: item.schemeName || 'Unknown',
              fundHouse: 'Unknown',
              category: 'Other',
              latestNAV: null,
              latestNAVDate: null,
              isActive: false
            };
          }
        })
      );

      res.status(200).json({ watchlist });

    } else if (req.method === 'POST') {
      // Add fund to watchlist
      const { schemeCode, schemeName } = req.body;

      if (!schemeCode) {
        return res.status(400).json({ error: 'schemeCode is required' });
      }

      // Verify fund exists by checking external API
      try {
        await axios.get(`https://api.mfapi.in/mf/${schemeCode}`, {
          timeout: 5000
        });
      } catch (error) {
        return res.status(404).json({ error: 'Fund not found in external API' });
      }

      // Check if already in watchlist
      const existing = await Watchlist.findOne({ userId, schemeCode });
      if (existing) {
        return res.status(400).json({ error: 'Fund already in watchlist' });
      }

      // Add to watchlist
      const watchlistItem = await Watchlist.create({
        userId,
        schemeCode,
        schemeName: schemeName || null,
        addedDate: new Date()
      });

      res.status(201).json({
        message: 'Fund added to watchlist',
        item: watchlistItem
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('[WATCHLIST API] Error:', error);
    console.error('[WATCHLIST API] Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
