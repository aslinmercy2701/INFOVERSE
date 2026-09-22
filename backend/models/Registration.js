const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    phone: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participantName: {
      type: String,
      required: [true, 'Participant name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    college: {
      type: String,
      required: [true, 'College is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
      trim: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    category: {
      type: String,
      enum: ['Technical', 'Non-Technical'],
      required: true,
    },
    teamName: {
      type: String,
      trim: true,
      default: '',
    },
    teamLeader: {
      type: String,
      trim: true,
      default: '',
    },
    teamMembers: {
      type: [teamMemberSchema],
      default: [],
    },
    presentationTitle: {
      type: String,
      trim: true,
      default: '',
    },
    uploadedFile: {
      type: String,
      default: '',
    },
    baseAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    referralCodeUsed: {
      type: String,
      default: '',
    },
    referralDiscount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    transactionId: {
      type: String,
      trim: true,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    generatedReferralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

// Index for fast lookups
registrationSchema.index({ userId: 1 });
registrationSchema.index({ eventId: 1 });
registrationSchema.index({ paymentStatus: 1 });
registrationSchema.index({ category: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
