const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  category: {
    type: String,
    enum: ['CULTURE', 'FOOD', 'NATURE', 'SHOPPING', 'ENTERTAINMENT', 'RELIGIOUS'],
    required: true
  },
  address: String,
  city: { type: String, required: true },
  district: String,
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
  priceRange: {
    type: String,
    enum: ['FREE', 'BUDGET', 'MODERATE', 'EXPENSIVE'],
    default: 'MODERATE'
  },
  images: [String],
  tags: [String],
  googlePlaceId: { type: String, unique: true, sparse: true },
  openingHours: mongoose.Schema.Types.Mixed,
  isActive: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 }
}, { timestamps: true });

locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ city: 1, category: 1 });
locationSchema.index({ isActive: 1, ratingAvg: -1 });

module.exports = mongoose.model('Location', locationSchema);
