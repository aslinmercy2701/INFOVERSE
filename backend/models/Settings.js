const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    symposiumName: {
      type: String,
      default: 'INFOVERSE 2026',
      trim: true,
    },
    college: {
      type: String,
      default: 'DMI Engineering College',
      trim: true,
    },
    department: {
      type: String,
      default: 'Department of Computer Science and Engineering',
      trim: true,
    },
    date: {
      type: String,
      default: '09/10/2026',
    },
    time: {
      type: String,
      default: '09:00 AM',
    },
    venue: {
      type: String,
      default: 'DMI Engineering College, Pallapatti',
      trim: true,
    },
    normalFee: {
      type: Number,
      default: 200,
    },
    paperFee: {
      type: Number,
      default: 600,
    },
    referralDiscount: {
      type: Number,
      default: 10,
    },
    upiId: {
      type: String,
      default: 'infoverse@upi',
      trim: true,
    },
    qrImage: {
      type: String,
      default: '',
      trim: true,
    },
    contactEmail: {
      type: String,
      default: 'infoverse@dmi.ac.in',
      trim: true,
    },
    contactPhone: {
      type: String,
      default: '+91 9876543210',
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
