const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  targetType: {
    type: String,
    enum: ['location', 'guide'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetType'
  }
}, { timestamps: true });

bookmarkSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
