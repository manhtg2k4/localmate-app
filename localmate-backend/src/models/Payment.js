const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking', required: true, unique: true
  },
  stripePaymentIntentId: { type: String, unique: true, sparse: true },
  stripeTransferId: String,
  amount: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  guideAmount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  status: {
    type: String,
    enum: ['PENDING', 'HELD', 'RELEASED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
    default: 'PENDING'
  },
  refundAmount: { type: Number, default: 0 },
  paidAt: Date,
  releasedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
