import connectDB from '../../lib/mongodb';
import VirtualPortfolio from '../../models/VirtualPortfolio';

export default async function handler(req, res) {
  const userId = 'default-user'; // In production, get from session/auth

  if (req.method === 'GET') {
    try {
      await connectDB();
      const sips = await VirtualPortfolio.find({ userId, isActive: { $ne: false } });
      const totals = calculateTotals(sips);
      res.status(200).json({ portfolio: sips, totals });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
  } else if (req.method === 'POST') {
    try {
      await connectDB();
      const sip = { ...req.body, userId };
      const newSip = new VirtualPortfolio(sip);
      await newSip.save();
      res.status(201).json({ id: newSip._id });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create SIP' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

function calculateTotals(sips) {
  let totalInvested = 0;
  let currentValue = 0;
  let totalReturn = 0;

  sips.forEach(sip => {
    totalInvested += sip.totalInvested || 0;
    currentValue += sip.currentValue || 0;
  });

  if (totalInvested > 0) {
    totalReturn = ((currentValue - totalInvested) / totalInvested) * 100;
  }

  return { totalInvested, currentValue, totalReturn };
}
