const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuideProfile', required: true
  },
  amount: { type: Number, required: true, min: 1 },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountHolder: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'rejected'],
    default: 'pending'
  },
  adminNote: String,
  processedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('WithdrawalRequest', withdrawalSchema);
