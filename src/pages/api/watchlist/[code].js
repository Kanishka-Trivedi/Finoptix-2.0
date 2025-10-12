import connectDB from '../../../lib/mongodb';
import Watchlist from '../../../models/Watchlist';

export default async function handler(req, res) {
  const { code } = req.query;
  const userId = 'default-user'; // In production, get from session/auth

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const result = await Watchlist.findOneAndDelete({
      userId,
      schemeCode: code
    });

    if (!result) {
      return res.status(404).json({ error: 'Watchlist item not found' });
    }

    res.status(200).json({ message: 'Fund removed from watchlist' });
  } catch (error) {
    console.error('Watchlist delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
