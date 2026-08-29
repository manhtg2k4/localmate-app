const GuideProfile = require('../models/GuideProfile');
const User = require('../models/User');
const { uploadImage } = require('../config/cloudinary');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination } = require('../utils/helpers');

exports.list = async (req, res, next) => {
  try {
    const { city, language, minRating, maxRate, sortBy } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const filter = { isApproved: true };
    if (city) filter.areas = { $in: [new RegExp(city, 'i')] };
    if (language) filter.languages = { $in: [new RegExp(language, 'i')] };
    if (minRating) filter.ratingAvg = { $gte: parseFloat(minRating) };
    if (maxRate) filter.hourlyRate = { $lte: parseFloat(maxRate) };

    const sort = {};
    if (sortBy === 'price') sort.hourlyRate = 1;
    else if (sortBy === 'tours') sort.totalTours = -1;
    else sort.ratingAvg = -1;

    const [guides, total] = await Promise.all([
      GuideProfile.find(filter)
        .populate('userId', 'fullName avatarUrl email nationality')
        .sort(sort).skip(skip).limit(limit).lean(),
      GuideProfile.countDocuments(filter)
    ]);

    return ApiResponse.paginate(res, guides, total, page, limit);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findById(req.params.id)
      .populate('userId', 'fullName avatarUrl email nationality')
      .lean();
    if (!guide) return ApiResponse.notFound(res, 'Guide not found');
    return ApiResponse.success(res, guide);
  } catch (err) { next(err); }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findOne({ userId: req.user._id })
      .populate('userId', 'fullName avatarUrl email nationality')
      .lean();
    if (!guide) return ApiResponse.notFound(res, 'Guide profile not found');
    return ApiResponse.success(res, guide);
  } catch (err) { next(err); }
};

exports.updateMyProfile = async (req, res, next) => {
  try {
    const { bio, languages, hourlyRate, dailyRate, areas, yearsExperience } = req.body;
    const guide = await GuideProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { bio, languages, hourlyRate, dailyRate, areas, yearsExperience } },
      { new: true, runValidators: true }
    );
    if (!guide) return ApiResponse.notFound(res, 'Guide not found');
    return ApiResponse.success(res, guide, 'Profile updated');
  } catch (err) { next(err); }
};

exports.registerAsGuide = async (req, res, next) => {
  try {
    const existing = await GuideProfile.findOne({ userId: req.user._id });
    if (!existing) return ApiResponse.error(res, 'Guide profile not found', 404);

    const { bio, languages, hourlyRate, dailyRate, areas, yearsExperience } = req.body;
    const idCardImages = req.files?.map(f => f.path) || [];

    const guide = await GuideProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { bio, languages, hourlyRate, dailyRate, areas, yearsExperience, idCardImages } },
      { new: true }
    );

    return ApiResponse.success(res, guide, 'Registration submitted for approval');
  } catch (err) { next(err); }
};

exports.getSchedule = async (req, res, next) => {
  try {
    const GuideSchedule = require('../models/GuideSchedule');
    const guide = await GuideProfile.findById(req.params.id);
    if (!guide) return ApiResponse.notFound(res, 'Guide not found');

    const { month, year } = req.query;
    const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) - 1, 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const schedules = await GuideSchedule.find({
      guideId: guide._id,
      date: { $gte: startDate, $lte: endDate }
    }).lean();

    return ApiResponse.success(res, schedules);
  } catch (err) { next(err); }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    const GuideSchedule = require('../models/GuideSchedule');
    const guide = await GuideProfile.findOne({ userId: req.user._id });
    if (!guide) return ApiResponse.notFound(res, 'Guide not found');

    const { date, slots } = req.body;

    const schedule = await GuideSchedule.findOneAndUpdate(
      { guideId: guide._id, date: new Date(date) },
      { $set: { slots } },
      { upsert: true, new: true }
    );

    return ApiResponse.success(res, schedule, 'Schedule updated');
  } catch (err) { next(err); }
};
