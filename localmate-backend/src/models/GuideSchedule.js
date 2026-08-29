const mongoose = require('mongoose');

const guideScheduleSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuideProfile', required: true
  },
  date: { type: Date, required: true },
  slots: [{
    startTime: String,
    endTime: String,
    status: {
      type: String,
      enum: ['available', 'booked', 'blocked'],
      default: 'available'
    },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
  }]
}, { timestamps: true });

guideScheduleSchema.index({ guideId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('GuideSchedule', guideScheduleSchema);
