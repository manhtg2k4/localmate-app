const Notification = require('../models/Notification');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination } = require('../utils/helpers');

exports.getMyNotifications = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { userId: req.user._id };

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId: req.user._id, isRead: false })
    ]);

    return ApiResponse.paginate(res, { notifications, unreadCount }, total, page, limit);
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true }
    );
    return ApiResponse.success(res, null, 'Marked as read');
  } catch (err) { next(err); }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    return ApiResponse.success(res, null, 'All marked as read');
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id, userId: req.user._id
    });
    return ApiResponse.success(res, null, 'Deleted');
  } catch (err) { next(err); }
};
