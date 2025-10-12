import mongoose from 'mongoose';

const WatchlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, default: 'default-user', index: true },
  schemeCode: { type: String, required: true, index: true },
  addedDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Compound index to ensure unique watchlist entries per user
WatchlistSchema.index({ userId: 1, schemeCode: 1 }, { unique: true });

export default mongoose.models.Watchlist || mongoose.model('Watchlist', WatchlistSchema);
