const mongoose = require('mongoose');

const guideProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true, unique: true
  },
  bio: String,
  languages: [{ type: String }],
  hourlyRate: { type: Number, min: 0, default: 0 },
  dailyRate: { type: Number, min: 0, default: 0 },
  ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  totalTours: { type: Number, default: 0 },
  areas: [{ type: String }],
  yearsExperience: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
  approvedAt: Date,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: String,
  idCardImages: [String],
  certificates: [String],
  stripeAccountId: String,
  galleryImages: [String]
}, { timestamps: true });

guideProfileSchema.index({ areas: 1 });
guideProfileSchema.index({ languages: 1 });
guideProfileSchema.index({ ratingAvg: -1 });
guideProfileSchema.index({ isApproved: 1 });

module.exports = mongoose.model('GuideProfile', guideProfileSchema);
