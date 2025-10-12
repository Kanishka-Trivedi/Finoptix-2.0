import mongoose from 'mongoose';

const VirtualPortfolioSchema = new mongoose.Schema({
  userId: { type: String, required: true, default: 'default-user', index: true },
  schemeCode: { type: String, required: true, index: true },
  schemeName: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: { type: String, required: true, enum: ['daily', 'weekly', 'monthly'] },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  totalInvested: { type: Number, default: 0 },
  currentValue: { type: Number, default: 0 },
  totalUnits: { type: Number, default: 0 },
  absoluteReturn: { type: Number, default: 0 },
  annualizedReturn: { type: Number, default: 0 },
  lastCalculated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

VirtualPortfolioSchema.index({ userId: 1, isActive: 1 });

export default mongoose.models.VirtualPortfolio || mongoose.model('VirtualPortfolio', VirtualPortfolioSchema);
