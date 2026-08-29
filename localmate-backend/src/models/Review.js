const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking', required: true, unique: true
  },
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuideProfile', required: true
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
  isHidden: { type: Boolean, default: false },
  hiddenReason: String
}, { timestamps: true });

reviewSchema.index({ guideId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
