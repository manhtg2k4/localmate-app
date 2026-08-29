const User = require('../models/User');
const { uploadImage } = require('../config/cloudinary');
const ApiResponse = require('../utils/ApiResponse');

exports.getMe = async (req, res, next) => {
  try {
    return ApiResponse.success(res, req.user);
  } catch (err) { next(err); }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { fullName, phone, nationality } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { fullName, phone, nationality } },
      { new: true, runValidators: true }
    );
    return ApiResponse.success(res, user, 'Profile updated');
  } catch (err) { next(err); }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return ApiResponse.error(res, 'No file uploaded', 400);
    const url = await uploadImage(req.file.path, 'localmate/avatars');
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl: url },
      { new: true }
    );
    return ApiResponse.success(res, { avatarUrl: url }, 'Avatar updated');
  } catch (err) { next(err); }
};

exports.updateFcmToken = async (req, res, next) => {
  try {
    const { fcmToken } = req.body;
    await User.findByIdAndUpdate(req.user._id, { fcmToken });
    return ApiResponse.success(res, null, 'FCM token updated');
  } catch (err) { next(err); }
};

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { deletedAt: new Date() });
    return ApiResponse.success(res, null, 'Account deleted');
  } catch (err) { next(err); }
};
