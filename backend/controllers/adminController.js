const Registration = require('../models/Registration');
const User = require('../models/User');
const Settings = require('../models/Settings');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');

/**
 * GET /api/admin/stats
 * Return comprehensive dashboard statistics using MongoDB aggregation
 */
const getStats = async (req, res) => {
  try {
    // Total registrations
    const totalRegistrations = await Registration.countDocuments();

    // Category counts
    const technicalRegistrations = await Registration.countDocuments({ category: 'Technical' });
    const nonTechnicalRegistrations = await Registration.countDocuments({ category: 'Non-Technical' });

    // Individual vs team
    const individualRegistrations = await Registration.countDocuments({
      $or: [{ teamMembers: { $size: 0 } }, { teamMembers: { $exists: false } }],
    });
    const teamRegistrations = await Registration.countDocuments({
      teamMembers: { $exists: true, $not: { $size: 0 } },
    });

    // Payment status counts
    const verifiedPayments = await Registration.countDocuments({ paymentStatus: 'verified' });
    const pendingPayments = await Registration.countDocuments({ paymentStatus: 'pending' });
    const rejectedPayments = await Registration.countDocuments({ paymentStatus: 'rejected' });

    // Total revenue from verified payments
    const revenueAgg = await Registration.aggregate([
      { $match: { paymentStatus: 'verified' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Referral statistics
    const referralRegistrations = await Registration.countDocuments({
      referralCodeUsed: { $exists: true, $ne: '' },
    });
    const referralDiscountAgg = await Registration.aggregate([
      { $match: { referralCodeUsed: { $exists: true, $ne: '' } } },
      { $group: { _id: null, total: { $sum: '$referralDiscount' } } },
    ]);
    const totalReferralDiscounts = referralDiscountAgg.length > 0 ? referralDiscountAgg[0].total : 0;

    // Event-wise registration counts with event names
    const eventWiseCounts = await Registration.aggregate([
      {
        $group: {
          _id: '$eventId',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event',
        },
      },
      {
        $unwind: { path: '$event', preserveNullAndEmpty: true },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          eventName: { $ifNull: ['$event.name', 'Unknown Event'] },
          category: { $ifNull: ['$event.category', 'Unknown'] },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Payment status distribution for charts
    const paymentStatusDistribution = [
      { name: 'Verified', value: verifiedPayments },
      { name: 'Pending', value: pendingPayments },
      { name: 'Rejected', value: rejectedPayments },
    ];

    // Recent 5 registrations
    const recentRegistrations = await Registration.find()
      .populate('eventId', 'name category')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return res.status(200).json({
      success: true,
      stats: {
        totalRegistrations,
        technicalRegistrations,
        nonTechnicalRegistrations,
        individualRegistrations,
        teamRegistrations,
        verifiedPayments,
        pendingPayments,
        rejectedPayments,
        totalRevenue,
        referralRegistrations,
        totalReferralDiscounts,
        eventWiseCounts,
        paymentStatusDistribution,
        recentRegistrations,
      },
    });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching stats.' });
  }
};

/**
 * GET /api/admin/registrations
 * Paginated, searchable, filterable list of all registrations
 */
const getAllRegistrations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      category = '',
      paymentStatus = '',
      eventId = '',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { participantName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { registrationId: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (eventId) {
      try { filter.eventId = new mongoose.Types.ObjectId(eventId); } catch {}
    }

    const total = await Registration.countDocuments(filter);
    const registrations = await Registration.find(filter)
      .populate('eventId', 'name category fee')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      registrations,
    });
  } catch (err) {
    console.error('getAllRegistrations error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching registrations.' });
  }
};

/**
 * GET /api/admin/registrations/:id
 * Get a single registration by registrationId (admin)
 */
const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findOne({ registrationId: req.params.id })
      .populate('eventId')
      .populate('userId', 'name email role');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    return res.status(200).json({ success: true, registration });
  } catch (err) {
    console.error('admin getRegistrationById error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching registration.' });
  }
};

/**
 * PUT /api/admin/registrations/:id
 * Update any field on a registration (admin)
 */
const updateRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOneAndUpdate(
      { registrationId: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('eventId');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    return res.status(200).json({ success: true, message: 'Registration updated.', registration });
  } catch (err) {
    console.error('updateRegistration error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating registration.' });
  }
};

/**
 * PUT /api/admin/registrations/:id/payment
 * Update payment status of a registration (admin only)
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, remarks } = req.body;

    if (!['pending', 'verified', 'rejected'].includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid payment status.' });
    }

    const registration = await Registration.findOne({ registrationId: req.params.id });
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    registration.paymentStatus = paymentStatus;
    await registration.save();

    // Also create/update Payment record
    await Payment.findOneAndUpdate(
      { registrationId: req.params.id },
      {
        $set: {
          registrationId: req.params.id,
          transactionId: registration.transactionId || 'N/A',
          amount: registration.finalAmount,
          status: paymentStatus,
          verifiedBy: req.user._id,
          verifiedAt: new Date(),
          remarks: remarks || '',
        },
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}.`,
      registration,
    });
  } catch (err) {
    console.error('updatePaymentStatus error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating payment status.' });
  }
};

/**
 * DELETE /api/admin/registrations/:id
 * Delete a registration (admin only)
 */
const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOneAndDelete({ registrationId: req.params.id });
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    // Also delete associated payment record if exists
    await Payment.findOneAndDelete({ registrationId: req.params.id });

    return res.status(200).json({ success: true, message: 'Registration deleted successfully.' });
  } catch (err) {
    console.error('deleteRegistration error:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting registration.' });
  }
};

/**
 * GET /api/admin/users
 * Get all users (paginated)
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      users,
    });
  } catch (err) {
    console.error('getAllUsers error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching users.' });
  }
};

/**
 * PUT /api/admin/users/:id/role
 * Update a user's role (admin only)
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be "user" or "admin".' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, message: `User role updated to ${role}.`, user });
  } catch (err) {
    console.error('updateUserRole error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.status(500).json({ success: false, message: 'Server error updating user role.' });
  }
};

/**
 * GET /api/admin/settings
 * Get the symposium settings (singleton)
 */
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return res.status(200).json({ success: true, settings });
  } catch (err) {
    console.error('getSettings error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching settings.' });
  }
};

/**
 * PUT /api/admin/settings
 * Update symposium settings (admin only)
 */
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    // Update only provided fields
    const allowedFields = [
      'symposiumName', 'college', 'department', 'date', 'time',
      'venue', 'normalFee', 'paperFee', 'referralDiscount',
      'upiId', 'qrImage', 'contactEmail', 'contactPhone',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    await settings.save();
    return res.status(200).json({ success: true, message: 'Settings updated successfully.', settings });
  } catch (err) {
    console.error('updateSettings error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating settings.' });
  }
};

module.exports = {
  getStats,
  getAllRegistrations,
  getRegistrationById,
  updateRegistration,
  updatePaymentStatus,
  deleteRegistration,
  getAllUsers,
  updateUserRole,
  getSettings,
  updateSettings,
};
