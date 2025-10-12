import connectDB from '../../../lib/mongodb';
import VirtualPortfolio from '../../../models/VirtualPortfolio';

export default async function handler(req, res) {
  const { id } = req.query;
  const userId = 'default-user'; // In production, get from session/auth

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const result = await VirtualPortfolio.findOneAndUpdate(
      { _id: id, userId },
      { isActive: false },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    res.status(200).json({ message: 'Portfolio item removed' });
  } catch (error) {
    console.error('Virtual Portfolio delete error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
