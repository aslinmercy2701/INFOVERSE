const mongoose = require('mongoose');

const referralCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    generatedByRegistrationId: {
      type: String,
      required: true,
      trim: true,
    },
    usedByRegistrationId: {
      type: String,
      default: null,
      trim: true,
    },
    discountAmount: {
      type: Number,
      default: 10,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

module.exports = mongoose.model('ReferralCode', referralCodeSchema);
