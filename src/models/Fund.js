import mongoose from 'mongoose';

const NavHistorySchema = new mongoose.Schema({
  date: { type: String, required: true },
  nav: { type: String, required: true }
}, { _id: false });

const FundSchema = new mongoose.Schema({
  schemeCode: { type: String, required: true, unique: true, index: true },
  schemeName: { type: String, required: true },
  fundHouse: { type: String, required: true },
  category: { type: String, required: true },
  schemeType: { type: String },
  schemeCategory: { type: String },
  isinGrowth: { type: String },
  isinDividend: { type: String },
  navHistory: [NavHistorySchema],
  lastUpdated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  latestNAV: { type: String },
  latestNAVDate: { type: String }
}, {
  timestamps: true
});

// Index for faster queries
FundSchema.index({ schemeName: 'text', fundHouse: 'text', category: 'text' });
FundSchema.index({ isActive: 1 });

export default mongoose.models.Fund || mongoose.model('Fund', FundSchema);
