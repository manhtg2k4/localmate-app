const cron = require('node-cron');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { refundPayment, releaseEscrow } = require('../services/payment.service');
const { notifyUser } = require('../services/notification.service');
const User = require('../models/User');

const autoRejectExpired = async () => {
  try {
    const expired = await Booking.find({
      status: 'PENDING',
      expiresAt: { $lt: new Date() }
    }).populate('touristId');

    for (const booking of expired) {
      booking.status = 'REJECTED';
      booking.cancelReason = 'Auto-rejected: guide did not respond in 30 minutes';
      await booking.save();

      const payment = await Payment.findOne({ bookingId: booking._id });
      if (payment?.status === 'HELD') await refundPayment(payment._id, 100);

      if (booking.touristId) {
        await notifyUser(
          booking.touristId,
          'Booking Auto-Cancelled',
          'Guide did not respond. Full refund issued.',
          'booking_rejected',
          { bookingId: booking._id.toString() }
        );
      }
    }

    if (expired.length > 0) {
      console.log(`Auto-rejected ${expired.length} expired bookings`);
    }
  } catch (err) {
    console.error('Auto-reject job error:', err.message);
  }
};

const releaseEscrowJob = async () => {
  try {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const payments = await Payment.find({
      status: 'HELD',
      paidAt: { $lt: cutoff }
    }).populate({ path: 'bookingId', select: 'status' });

    for (const payment of payments) {
      if (payment.bookingId?.status === 'COMPLETED') {
        await releaseEscrow(payment._id);
        console.log(`Released escrow for payment: ${payment._id}`);
      }
    }
  } catch (err) {
    console.error('Escrow release job error:', err.message);
  }
};

const startJobs = () => {
  // Auto-reject every 5 minutes
  cron.schedule('*/5 * * * *', autoRejectExpired);
  // Release escrow every hour
  cron.schedule('0 * * * *', releaseEscrowJob);
  console.log('✅ Cron jobs started');
};

module.exports = { startJobs, autoRejectExpired, releaseEscrowJob };
