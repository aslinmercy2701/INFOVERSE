const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Technical', 'Non-Technical'],
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    rules: {
      type: [String],
      default: [],
    },
    teamSize: {
      min: {
        type: Number,
        default: 1,
      },
      max: {
        type: Number,
        default: 1,
      },
    },
    mode: {
      type: String,
      enum: ['Online', 'Offline'],
      required: [true, 'Mode is required'],
    },
    fee: {
      type: Number,
      required: [true, 'Fee is required'],
      min: [0, 'Fee cannot be negative'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    isTeamEvent: {
      type: Boolean,
      default: false,
    },
    requiresUpload: {
      type: Boolean,
      default: false,
    },
    maxParticipants: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'disabled'],
      default: 'active',
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

module.exports = mongoose.model('Event', eventSchema);
