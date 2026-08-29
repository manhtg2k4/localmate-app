const User = require('../models/User');
const GuideProfile = require('../models/GuideProfile');
const Wallet = require('../models/Wallet');
const { generateTokens } = require('../utils/helpers');
const { sendWelcomeEmail } = require('../services/email.service');
const ApiResponse = require('../utils/ApiResponse');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { email, password, fullName, nationality, role } = req.body;

    if (!['TOURIST', 'GUIDE'].includes(role)) {
      return ApiResponse.error(res, 'Role must be TOURIST or GUIDE', 400);
    }

    const exists = await User.findOne({ email });
    if (exists) return ApiResponse.error(res, 'Email already exists', 409);

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      email, passwordHash, fullName, nationality, role, isVerified: false
    });

    // Create guide profile if GUIDE
    if (role === 'GUIDE') {
      const guide = await GuideProfile.create({ userId: user._id });
      await Wallet.create({ guideId: guide._id });
    }

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    user.refreshTokens.push(refreshToken);
    await user.save();

    await sendWelcomeEmail(user).catch(() => {});

    return ApiResponse.created(res, {
      accessToken, refreshToken,
      user: {
        _id: user._id, email: user.email,
        fullName: user.fullName, role: user.role,
        isVerified: user.isVerified
      }
    }, 'Registration successful');
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, deletedAt: null, isBlocked: false });
    if (!user) return ApiResponse.error(res, 'Invalid email or password', 401);

    if (!user.passwordHash) {
      return ApiResponse.error(res, 'Please use Google login', 400);
    }

    const valid = await user.comparePassword(password);
    if (!valid) return ApiResponse.error(res, 'Invalid email or password', 401);

    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    user.refreshTokens.push(refreshToken);
    // Keep only last 5 refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    await user.save();

    return ApiResponse.success(res, {
      accessToken, refreshToken,
      user: {
        _id: user._id, email: user.email,
        fullName: user.fullName, role: user.role,
        avatarUrl: user.avatarUrl, isVerified: user.isVerified
      }
    }, 'Login successful');
  } catch (err) { next(err); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return ApiResponse.error(res, 'Refresh token required', 400);

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return ApiResponse.unauthorized(res, 'Invalid refresh token');
    }

    // Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id, user.role);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    return ApiResponse.success(res, { accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return ApiResponse.unauthorized(res, 'Invalid refresh token');
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { refreshTokens: refreshToken }
      });
    }
    return ApiResponse.success(res, null, 'Logged out successfully');
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    return ApiResponse.success(res, req.user);
  } catch (err) { next(err); }
};
