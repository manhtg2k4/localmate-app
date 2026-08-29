const Message = require('../models/Message');
const Booking = require('../models/Booking');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination } = require('../utils/helpers');

exports.getMessages = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { page, limit, skip } = getPagination(req.query);

    const booking = await Booking.findById(bookingId);
    if (!booking) return ApiResponse.notFound(res, 'Booking not found');

    const [messages, total] = await Promise.all([
      Message.find({ bookingId })
        .populate('senderId', 'fullName avatarUrl')
        .sort({ createdAt: 1 }).skip(skip).limit(limit).lean(),
      Message.countDocuments({ bookingId })
    ]);

    // Mark as read
    await Message.updateMany(
      { bookingId, receiverId: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return ApiResponse.paginate(res, messages, total, page, limit);
  } catch (err) { next(err); }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { text, imageUrl, receiverId } = req.body;

    const message = await Message.create({
      bookingId, text, imageUrl,
      senderId: req.user._id,
      receiverId,
      messageType: imageUrl ? 'image' : 'text'
    });

    const populated = await message.populate('senderId', 'fullName avatarUrl');

    const io = req.app.get('io');
    io?.to(`booking:${bookingId}`).emit('message:new', populated);

    return ApiResponse.created(res, populated);
  } catch (err) { next(err); }
};

exports.markRead = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    await Message.updateMany(
      { bookingId, receiverId: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    return ApiResponse.success(res, null, 'Messages marked as read');
  } catch (err) { next(err); }
};
