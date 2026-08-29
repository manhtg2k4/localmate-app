const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuideProfile', required: true, unique: true
  },
  balance: { type: Number, default: 0, min: 0 },
  pendingBalance: { type: Number, default: 0, min: 0 },
  totalEarned: { type: Number, default: 0, min: 0 },
  stripeAccountId: String
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
