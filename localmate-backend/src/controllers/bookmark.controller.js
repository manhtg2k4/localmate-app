const Bookmark = require('../models/Bookmark');
const ApiResponse = require('../utils/ApiResponse');

exports.getMyBookmarks = async (req, res, next) => {
  try {
    const { targetType } = req.query;
    const filter = { userId: req.user._id };
    if (targetType) filter.targetType = targetType;

    const bookmarks = await Bookmark.find(filter)
      .sort({ createdAt: -1 }).lean();

    return ApiResponse.success(res, bookmarks);
  } catch (err) { next(err); }
};

exports.toggle = async (req, res, next) => {
  try {
    const { targetId, targetType } = req.body;

    const exists = await Bookmark.findOne({
      userId: req.user._id, targetId, targetType
    });

    if (exists) {
      await Bookmark.deleteOne({ _id: exists._id });
      return ApiResponse.success(res, { bookmarked: false }, 'Removed from favorites');
    }

    const bookmark = await Bookmark.create({
      userId: req.user._id, targetId, targetType
    });
    return ApiResponse.created(res, { bookmarked: true, bookmark }, 'Added to favorites');
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await Bookmark.findOneAndDelete({
      _id: req.params.id, userId: req.user._id
    });
    return ApiResponse.success(res, null, 'Removed from favorites');
  } catch (err) { next(err); }
};
