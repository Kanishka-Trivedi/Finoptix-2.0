import connectDB from '../../../lib/mongodb';
import Watchlist from '../../../models/Watchlist';
import Fund from '../../../models/Fund';

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

      // Get fund details for each watchlist item
      const schemeCodes = watchlistItems.map(item => item.schemeCode);
      const funds = await Fund.find({ schemeCode: { $in: schemeCodes } }).lean();

      // Create a map for quick lookup
      const fundMap = {};
      funds.forEach(fund => {
        fundMap[fund.schemeCode] = fund;
      });

      // Combine watchlist with fund data
      const watchlist = watchlistItems.map(item => {
        const fund = fundMap[item.schemeCode];
        return {
          _id: item._id,
          schemeCode: item.schemeCode,
          addedDate: item.addedDate,
          schemeName: fund?.schemeName || 'Unknown',
          fundHouse: fund?.fundHouse || 'Unknown',
          category: fund?.category || 'Other',
          latestNAV: fund?.latestNAV || null,
          latestNAVDate: fund?.latestNAVDate || null,
          isActive: fund?.isActive || false
        };
      });

      res.status(200).json({ watchlist });

    } else if (req.method === 'POST') {
      // Add fund to watchlist
      const { schemeCode } = req.body;

      if (!schemeCode) {
        return res.status(400).json({ error: 'schemeCode is required' });
      }

      // Check if fund exists
      const fund = await Fund.findOne({ schemeCode });
      if (!fund) {
        return res.status(404).json({ error: 'Fund not found' });
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
