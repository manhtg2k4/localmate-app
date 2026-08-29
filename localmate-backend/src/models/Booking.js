const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuideProfile', required: true
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  totalHours: { type: Number, min: 0 },
  type: {
    type: String,
    enum: ['HOURLY', 'DAILY'],
    required: true
  },
  basePrice: { type: Number, required: true, min: 0 },
  platformFee: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  specialRequests: String,
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancelReason: String,
  expiresAt: Date,
  completedAt: Date
}, { timestamps: true });

bookingSchema.index({ touristId: 1, status: 1, createdAt: -1 });
bookingSchema.index({ guideId: 1, status: 1, createdAt: -1 });
bookingSchema.index({ expiresAt: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
