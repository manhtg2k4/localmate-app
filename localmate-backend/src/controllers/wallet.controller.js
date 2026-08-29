const Wallet = require('../models/Wallet');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const GuideProfile = require('../models/GuideProfile');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination } = require('../utils/helpers');

exports.getMyWallet = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findOne({ userId: req.user._id });
    if (!guide) return ApiResponse.notFound(res, 'Guide not found');

    let wallet = await Wallet.findOne({ guideId: guide._id });
    if (!wallet) wallet = await Wallet.create({ guideId: guide._id });

    return ApiResponse.success(res, wallet);
  } catch (err) { next(err); }
};

exports.requestWithdrawal = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findOne({ userId: req.user._id });
    if (!guide) return ApiResponse.notFound(res, 'Guide not found');

    const wallet = await Wallet.findOne({ guideId: guide._id });
    if (!wallet) return ApiResponse.error(res, 'Wallet not found', 404);

    const { amount, bankName, accountNumber, accountHolder } = req.body;

    if (wallet.balance < amount) {
      return ApiResponse.error(res, 'Insufficient balance', 400);
    }

    const withdrawal = await WithdrawalRequest.create({
      guideId: guide._id, amount, bankName, accountNumber, accountHolder
    });

    // Deduct from wallet
    wallet.balance -= amount;
    await wallet.save();

    return ApiResponse.created(res, withdrawal, 'Withdrawal request submitted');
  } catch (err) { next(err); }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findOne({ userId: req.user._id });
    if (!guide) return ApiResponse.notFound(res, 'Guide not found');

    const { page, limit, skip } = getPagination(req.query);

    const [withdrawals, total] = await Promise.all([
      WithdrawalRequest.find({ guideId: guide._id })
        .sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      WithdrawalRequest.countDocuments({ guideId: guide._id })
    ]);

    return ApiResponse.paginate(res, withdrawals, total, page, limit);
  } catch (err) { next(err); }
};
