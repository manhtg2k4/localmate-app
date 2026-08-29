const Review = require('../models/Review');
const Booking = require('../models/Booking');
const GuideProfile = require('../models/GuideProfile');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination } = require('../utils/helpers');

exports.create = async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      touristId: req.user._id,
      status: 'COMPLETED'
    });
    if (!booking) return ApiResponse.error(res, 'Can only review completed bookings', 400);

    const exists = await Review.findOne({ bookingId });
    if (exists) return ApiResponse.error(res, 'Already reviewed this booking', 409);

    const review = await Review.create({
      bookingId,
      touristId: req.user._id,
      guideId: booking.guideId,
      rating, comment
    });

    // Update guide rating average
    const stats = await Review.aggregate([
      { $match: { guideId: booking.guideId, isHidden: false } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
      await GuideProfile.findByIdAndUpdate(booking.guideId, {
        ratingAvg: parseFloat(stats[0].avg.toFixed(2)),
        totalReviews: stats[0].count
      });
    }

    return ApiResponse.created(res, review, 'Review submitted');
  } catch (err) { next(err); }
};

exports.getGuideReviews = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { guideId: req.params.guideId, isHidden: false };

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('touristId', 'fullName avatarUrl nationality')
        .sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Review.countDocuments(filter)
    ]);

    return ApiResponse.paginate(res, reviews, total, page, limit);
  } catch (err) { next(err); }
};
