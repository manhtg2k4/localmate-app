const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: {
    type: String,
    enum: ['booking_new', 'booking_confirmed', 'booking_rejected',
           'payment_success', 'review_new', 'system', 'chat_new',
           'booking_completed', 'wallet_credited'],
    required: true
  },
  data: mongoose.Schema.Types.Mixed,
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
