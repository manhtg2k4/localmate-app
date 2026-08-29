const Booking = require('../models/Booking');
const GuideProfile = require('../models/GuideProfile');
const User = require('../models/User');
const { calculateBookingPrice, getPagination } = require('../utils/helpers');
const { notifyUser } = require('../services/notification.service');
const { refundPayment } = require('../services/payment.service');
const ApiResponse = require('../utils/ApiResponse');

exports.create = async (req, res, next) => {
  try {
    const { guideId, locationId, bookingDate, startTime, endTime, type, specialRequests } = req.body;

    const guide = await GuideProfile.findById(guideId).populate('userId');
    if (!guide) return ApiResponse.notFound(res, 'Guide not found');
    if (!guide.isApproved) return ApiResponse.error(res, 'Guide not approved', 400);

    const pricing = calculateBookingPrice(guide, startTime, endTime, type);

    const booking = await Booking.create({
      touristId: req.user._id,
      guideId,
      locationId,
      bookingDate: new Date(bookingDate),
      startTime, endTime, type,
      ...pricing,
      specialRequests,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 min
    });

    await booking.populate([
      { path: 'touristId', select: 'fullName avatarUrl' },
      { path: 'guideId', populate: { path: 'userId', select: 'fullName avatarUrl fcmToken' } },
      { path: 'locationId', select: 'name city' }
    ]);

    // Notify guide
    if (guide.userId?.fcmToken) {
      await notifyUser(
        guide.userId,
        'New Booking Request! 🎉',
        `${req.user.fullName} wants to book you on ${bookingDate}`,
        'booking_new',
        { bookingId: booking._id.toString() }
      );
    }

    // Emit socket event
    const io = req.app.get('io');
    io?.to(`user:${guide.userId._id}`).emit('booking:new', booking);

    return ApiResponse.created(res, booking, 'Booking created');
  } catch (err) { next(err); }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const filter = { touristId: req.user._id };
    if (status) filter.status = status.toUpperCase();

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('guideId', 'userId hourlyRate dailyRate ratingAvg')
        .populate({ path: 'guideId', populate: { path: 'userId', select: 'fullName avatarUrl' } })
        .populate('locationId', 'name city images')
        .sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Booking.countDocuments(filter)
    ]);

    return ApiResponse.paginate(res, bookings, total, page, limit);
  } catch (err) { next(err); }
};

exports.getGuideBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const guide = await GuideProfile.findOne({ userId: req.user._id });
    if (!guide) return ApiResponse.notFound(res, 'Guide not found');

    const filter = { guideId: guide._id };
    if (status) filter.status = status.toUpperCase();

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('touristId', 'fullName avatarUrl nationality')
        .populate('locationId', 'name city')
        .sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Booking.countDocuments(filter)
    ]);

    return ApiResponse.paginate(res, bookings, total, page, limit);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('touristId', 'fullName avatarUrl nationality phone')
      .populate({ path: 'guideId', populate: { path: 'userId', select: 'fullName avatarUrl' } })
      .populate('locationId', 'name city address images')
      .lean();

    if (!booking) return ApiResponse.notFound(res, 'Booking not found');
    return ApiResponse.success(res, booking);
  } catch (err) { next(err); }
};

exports.confirm = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findOne({ userId: req.user._id });
    const booking = await Booking.findOne({
      _id: req.params.id,
      guideId: guide?._id,
      status: 'PENDING'
    }).populate('touristId');

    if (!booking) return ApiResponse.notFound(res, 'Booking not found');

    booking.status = 'CONFIRMED';
    await booking.save();

    await notifyUser(
      booking.touristId,
      'Booking Confirmed! ✅',
      'Your guide has accepted your booking',
      'booking_confirmed',
      { bookingId: booking._id.toString() }
    );

    const io = req.app.get('io');
    io?.to(`user:${booking.touristId._id}`).emit('booking:confirmed', booking);

    return ApiResponse.success(res, booking, 'Booking confirmed');
  } catch (err) { next(err); }
};

exports.reject = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findOne({ userId: req.user._id });
    const booking = await Booking.findOne({
      _id: req.params.id,
      guideId: guide?._id,
      status: 'PENDING'
    }).populate('touristId');

    if (!booking) return ApiResponse.notFound(res, 'Booking not found');

    booking.status = 'REJECTED';
    booking.cancelReason = req.body.reason || 'Guide rejected the booking';
    await booking.save();

    // Refund tourist
    const Payment = require('../models/Payment');
    const payment = await Payment.findOne({ bookingId: booking._id });
    if (payment?.status === 'HELD') await refundPayment(payment._id, 100);

    await notifyUser(
      booking.touristId,
      'Booking Rejected',
      `Your guide rejected the booking: ${booking.cancelReason}`,
      'booking_rejected',
      { bookingId: booking._id.toString() }
    );

    return ApiResponse.success(res, booking, 'Booking rejected');
  } catch (err) { next(err); }
};

exports.cancel = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('touristId guideId');

    if (!booking) return ApiResponse.notFound(res, 'Booking not found');

    const cancelableStatuses = ['PENDING', 'CONFIRMED'];
    if (!cancelableStatuses.includes(booking.status)) {
      return ApiResponse.error(res, 'Cannot cancel this booking', 400);
    }

    // Refund policy
    const now = new Date();
    const bookingDate = new Date(booking.bookingDate);
    const hoursUntil = (bookingDate - now) / (1000 * 60 * 60);

    let refundPercent = 0;
    if (hoursUntil > 24) refundPercent = 100;
    else if (hoursUntil > 12) refundPercent = 50;

    booking.status = 'CANCELLED';
    booking.cancelledBy = req.user._id;
    booking.cancelReason = req.body.reason;
    await booking.save();

    if (refundPercent > 0) {
      const Payment = require('../models/Payment');
      const payment = await Payment.findOne({ bookingId: booking._id });
      if (payment?.status === 'HELD') await refundPayment(payment._id, refundPercent);
    }

    return ApiResponse.success(res, { booking, refundPercent }, 'Booking cancelled');
  } catch (err) { next(err); }
};

exports.complete = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findOne({ userId: req.user._id });
    const booking = await Booking.findOne({
      _id: req.params.id,
      guideId: guide?._id,
      status: 'CONFIRMED'
    });

    if (!booking) return ApiResponse.notFound(res, 'Booking not found');

    booking.status = 'COMPLETED';
    booking.completedAt = new Date();
    await booking.save();

    // Increment Guide totalTours
    await GuideProfile.findByIdAndUpdate(guide._id, {
      $inc: { totalTours: 1 }
    });

    // Credit Guide's Wallet (Base Price = Total Amount - Platform Fee)
    const Wallet = require('../models/Wallet');
    const netEarnings = booking.basePrice || (booking.totalAmount - booking.platformFee);
    let wallet = await Wallet.findOne({ guideId: guide._id });
    if (!wallet) {
      wallet = await Wallet.create({ guideId: guide._id, balance: netEarnings, totalEarned: netEarnings });
    } else {
      wallet.balance += netEarnings;
      wallet.totalEarned = (wallet.totalEarned || 0) + netEarnings;
      await wallet.save();
    }

    // Schedule escrow release after 48h if applicable
    setTimeout(async () => {
      const Payment = require('../models/Payment');
      const payment = await Payment.findOne({ bookingId: booking._id });
      if (payment) {
        const { releaseEscrow } = require('../services/payment.service');
        await releaseEscrow(payment._id);
      }
    }, 48 * 60 * 60 * 1000);

    return ApiResponse.success(res, booking, 'Booking completed and wallet credited');
  } catch (err) { next(err); }
};
