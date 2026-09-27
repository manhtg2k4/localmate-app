const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String, required: true, unique: true,
    lowercase: true, trim: true
  },
  passwordHash: String,
  fullName: { type: String, required: true, trim: true },
  phone: String,
  avatarUrl: String,
  nationality: String,
  role: {
    type: String,
    enum: ['TOURIST', 'GUIDE', 'ADMIN'],
    required: true
  },
  isVerified: { type: Boolean, default: false },
  googleId: { type: String, unique: true, sparse: true },
  fcmToken: String,
  refreshTokens: [{ type: String }],
  isBlocked: { type: Boolean, default: false },
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.passwordHash;
      delete ret.refreshTokens;
      return ret;
    }
  }
});

userSchema.index({ role: 1, isBlocked: 1 });
userSchema.index({ createdAt: -1 });

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = async function(password) {
  return bcrypt.hash(password, 12);
};

module.exports = mongoose.model('User', userSchema);
