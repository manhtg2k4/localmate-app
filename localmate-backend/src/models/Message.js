const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking', required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  text: String,
  imageUrl: String,
  isRead: { type: Boolean, default: false },
  messageType: {
    type: String,
    enum: ['text', 'image'],
    default: 'text'
  }
}, { timestamps: true });

messageSchema.index({ bookingId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
