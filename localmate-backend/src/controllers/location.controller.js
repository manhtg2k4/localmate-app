const Location = require('../models/Location');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination } = require('../utils/helpers');

exports.list = async (req, res, next) => {
  try {
    const { city, category, priceRange, search } = req.query;
    const { page, limit, skip } = getPagination(req.query);

    const filter = { isActive: true };
    if (city) filter.city = new RegExp(city, 'i');
    if (category) filter.category = category.toUpperCase();
    if (priceRange) filter.priceRange = priceRange.toUpperCase();
    if (search) filter.name = new RegExp(search, 'i');

    const [locations, total] = await Promise.all([
      Location.find(filter)
        .sort({ ratingAvg: -1 }).skip(skip).limit(limit).lean(),
      Location.countDocuments(filter)
    ]);

    return ApiResponse.paginate(res, locations, total, page, limit);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).lean();
    if (!location) return ApiResponse.notFound(res, 'Location not found');
    return ApiResponse.success(res, location);
  } catch (err) { next(err); }
};

exports.getNearby = async (req, res, next) => {
  try {
    const { lat, lng, maxDistance = 5000, limit = 10 } = req.query;
    if (!lat || !lng) return ApiResponse.error(res, 'lat and lng required', 400);

    const locations = await Location.find({
      isActive: true,
      coordinates: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).limit(parseInt(limit)).lean();

    return ApiResponse.success(res, locations);
  } catch (err) { next(err); }
};
