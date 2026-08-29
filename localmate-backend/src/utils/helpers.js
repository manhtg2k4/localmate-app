const jwt = require('jsonwebtoken');

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '1h' }
  );
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );
  return { accessToken, refreshToken };
};

const calculateBookingPrice = (guide, startTime, endTime, type) => {
  const PLATFORM_FEE = (process.env.PLATFORM_FEE_PERCENT || 15) / 100;

  let basePrice, totalHours;

  if (type === 'DAILY') {
    basePrice = guide.dailyRate;
    totalHours = 8;
  } else {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    totalHours = (endH * 60 + endM - startH * 60 - startM) / 60;
    if (totalHours < 2) throw new Error('Minimum booking is 2 hours');
    basePrice = guide.hourlyRate * totalHours;
  }

  const platformFee = parseFloat((basePrice * PLATFORM_FEE).toFixed(2));
  const totalAmount = parseFloat((basePrice + platformFee).toFixed(2));

  return { basePrice, platformFee, totalAmount, totalHours };
};

const getPagination = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { generateTokens, calculateBookingPrice, getPagination };
