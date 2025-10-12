import connectDB from '../../../lib/mongodb';
import VirtualPortfolio from '../../../models/VirtualPortfolio';
import Fund from '../../../models/Fund';
import { calculateSIP } from '../../../utils/calculations';

export default async function handler(req, res) {
  const userId = 'default-user'; // In production, get from session/auth

  try {
    await connectDB();

    if (req.method === 'GET') {
      // Get user's virtual portfolio
      const portfolioItems = await VirtualPortfolio.find({ userId, isActive: true })
        .sort({ createdAt: -1 })
        .lean();

      // Recalculate current values for each item
      const updatedPortfolio = [];

      for (const item of portfolioItems) {
        const fund = await Fund.findOne({ schemeCode: item.schemeCode }).lean();

        if (fund && fund.navHistory && fund.navHistory.length > 0) {
          // Recalculate SIP
          const sipResult = calculateSIP(
            fund.navHistory,
            item.amount,
            item.frequency,
            item.startDate,
            item.endDate
          );

          if (!sipResult.error) {
            // Update the portfolio item
            await VirtualPortfolio.findByIdAndUpdate(item._id, {
              totalInvested: sipResult.totalInvested,
              currentValue: sipResult.currentValue,
              totalUnits: parseFloat(sipResult.totalUnitsPurchased),
              absoluteReturn: parseFloat(sipResult.absoluteReturn),
              annualizedReturn: parseFloat(sipResult.annualizedReturn),
              lastCalculated: new Date()
            });

            updatedPortfolio.push({
              ...item,
              totalInvested: sipResult.totalInvested,
              currentValue: sipResult.currentValue,
              totalUnits: parseFloat(sipResult.totalUnitsPurchased),
              absoluteReturn: parseFloat(sipResult.absoluteReturn),
              annualizedReturn: parseFloat(sipResult.annualizedReturn),
              fundHouse: fund.fundHouse,
              category: fund.category
            });
          } else {
            updatedPortfolio.push({
              ...item,
              error: sipResult.error,
              fundHouse: fund.fundHouse,
              category: fund.category
            });
          }
        } else {
          updatedPortfolio.push({
            ...item,
            error: 'Fund data not available',
            fundHouse: 'Unknown',
            category: 'Unknown'
          });
        }
      }

      // Calculate totals
      const totals = updatedPortfolio.reduce((acc, item) => {
        if (!item.error) {
          acc.totalInvested += item.totalInvested || 0;
          acc.currentValue += item.currentValue || 0;
        }
        return acc;
      }, { totalInvested: 0, currentValue: 0 });

      totals.totalReturn = totals.totalInvested > 0
        ? ((totals.currentValue - totals.totalInvested) / totals.totalInvested * 100).toFixed(2)
        : 0;

      res.status(200).json({
        portfolio: updatedPortfolio,
        totals
      });

    } else if (req.method === 'POST') {
      // Create new virtual SIP
      const { schemeCode, schemeName, amount, frequency, startDate, endDate } = req.body;

      if (!schemeCode || !amount || !frequency || !startDate || !endDate) {
        return res.status(400).json({
          error: 'schemeCode, amount, frequency, startDate, and endDate are required'
        });
      }

      // Validate frequency
      if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
        return res.status(400).json({
          error: 'frequency must be daily, weekly, or monthly'
        });
      }

      // Get fund data
      const fund = await Fund.findOne({ schemeCode }).lean();

      if (!fund) {
        return res.status(404).json({ error: 'Fund not found' });
      }

      // Calculate initial SIP
      const sipResult = calculateSIP(
        fund.navHistory,
        parseFloat(amount),
        frequency,
        startDate,
        endDate
      );

      if (sipResult.error) {
        return res.status(400).json({ error: sipResult.error });
      }

      // Create portfolio entry
      const portfolioItem = await VirtualPortfolio.create({
        userId,
        schemeCode,
        schemeName: schemeName || fund.schemeName,
        amount: parseFloat(amount),
        frequency,
        startDate,
        endDate,
        totalInvested: sipResult.totalInvested,
        currentValue: sipResult.currentValue,
        totalUnits: parseFloat(sipResult.totalUnitsPurchased),
        absoluteReturn: parseFloat(sipResult.absoluteReturn),
        annualizedReturn: parseFloat(sipResult.annualizedReturn),
        lastCalculated: new Date(),
        isActive: true
      });

      res.status(201).json({
        message: 'Virtual SIP created',
        item: portfolioItem
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Virtual Portfolio API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
