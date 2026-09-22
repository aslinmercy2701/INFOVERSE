const Registration = require('../models/Registration');
const ReferralCode = require('../models/ReferralCode');
const Event = require('../models/Event');

/**
 * Generate a unique registration ID: INF-2026-XXXX
 */
const generateRegistrationId = async () => {
  const count = await Registration.countDocuments();
  const padded = String(count + 1).padStart(4, '0');
  return `INF-2026-${padded}`;
};

/**
 * Generate a random referral code: INF-XXXXXX (6 uppercase alphanumeric chars)
 */
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'INF-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * POST /api/registrations
 * Create a new registration for an event
 */
const createRegistration = async (req, res) => {
  try {
    const {
      participantName, email, phone, department, college, year,
      eventId, category,
      teamName, teamLeader, teamMembers,
      presentationTitle,
      referralCodeUsed,
      transactionId,
    } = req.body;

    // Parse teamMembers if it came as a JSON string (multipart form)
    let parsedTeamMembers = [];
    if (teamMembers) {
      if (typeof teamMembers === 'string') {
        try { parsedTeamMembers = JSON.parse(teamMembers); } catch { parsedTeamMembers = []; }
      } else if (Array.isArray(teamMembers)) {
        parsedTeamMembers = teamMembers;
      }
    }

    // Basic field validation
    if (!participantName || !email || !phone || !department || !college || !year || !eventId || !category) {
      return res.status(400).json({ success: false, message: 'Missing required registration fields.' });
    }

    // Fetch event from DB
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    if (event.status === 'disabled') {
      return res.status(400).json({ success: false, message: 'This event is currently disabled.' });
    }

    // BACKEND fee calculation — never trust frontend
    const baseAmount = event.name === 'Paper Preparation' ? 600 : 200;

    // Paper Preparation requires exactly 3 team members
    if (event.name === 'Paper Preparation') {
      if (!parsedTeamMembers || parsedTeamMembers.length !== 3) {
        return res.status(400).json({
          success: false,
          message: 'Paper Preparation requires exactly 3 team members.',
        });
      }
      if (!presentationTitle || !presentationTitle.trim()) {
        return res.status(400).json({ success: false, message: 'Presentation title is required for Paper Preparation.' });
      }
    }

    // Referral code handling
    let referralDiscount = 0;
    let referralCodeDoc = null;
    const trimmedReferralCode = referralCodeUsed ? referralCodeUsed.trim().toUpperCase() : '';

    if (trimmedReferralCode) {
      referralCodeDoc = await ReferralCode.findOne({ code: trimmedReferralCode });

      if (!referralCodeDoc) {
        return res.status(400).json({ success: false, message: 'Invalid referral code.' });
      }

      if (referralCodeDoc.isUsed) {
        return res.status(400).json({ success: false, message: 'This referral code has already been used.' });
      }

      // Prevent using own referral code: find the registration that generated this code
      const generatingReg = await Registration.findOne({ registrationId: referralCodeDoc.generatedByRegistrationId });
      if (generatingReg && generatingReg.userId.toString() === req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'You cannot use your own referral code.' });
      }

      referralDiscount = referralCodeDoc.discountAmount || 10;
    }

    const finalAmount = Math.max(0, baseAmount - referralDiscount);

    // Generate unique IDs
    const registrationId = await generateRegistrationId();
    let generatedReferralCode = generateReferralCode();

    // Ensure generated code is unique (retry once if collision)
    const existingCode = await ReferralCode.findOne({ code: generatedReferralCode });
    if (existingCode) {
      generatedReferralCode = generateReferralCode();
    }

    // Uploaded file name from multer
    const uploadedFile = req.file ? req.file.filename : '';

    // Build and save registration document
    const registration = new Registration({
      registrationId,
      userId: req.user._id,
      participantName: participantName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      department: department.trim(),
      college: college.trim(),
      year: year.trim(),
      eventId,
      category,
      teamName: teamName ? teamName.trim() : '',
      teamLeader: teamLeader ? teamLeader.trim() : '',
      teamMembers: parsedTeamMembers,
      presentationTitle: presentationTitle ? presentationTitle.trim() : '',
      uploadedFile,
      baseAmount,
      referralCodeUsed: trimmedReferralCode,
      referralDiscount,
      finalAmount,
      transactionId: transactionId ? transactionId.trim() : '',
      paymentStatus: 'pending',
      generatedReferralCode,
    });

    await registration.save();

    // Save the generated referral code document
    const newReferralCodeDoc = new ReferralCode({
      code: generatedReferralCode,
      generatedByRegistrationId: registrationId,
      discountAmount: 10,
      isUsed: false,
    });
    await newReferralCodeDoc.save();

    // Mark referral code as used if one was applied
    if (referralCodeDoc) {
      referralCodeDoc.isUsed = true;
      referralCodeDoc.usedByRegistrationId = registrationId;
      referralCodeDoc.usedAt = new Date();
      await referralCodeDoc.save();
    }

    // Populate event for response
    const populatedRegistration = await Registration.findById(registration._id).populate('eventId');

    return res.status(201).json({
      success: true,
      message: 'Registration created successfully.',
      registration: populatedRegistration,
      generatedReferralCode,
    });
  } catch (err) {
    console.error('createRegistration error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Duplicate registration. Please try again.' });
    }
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

/**
 * GET /api/registrations/my
 * Get all registrations for the currently logged-in user
 */
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate('eventId')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: registrations.length, registrations });
  } catch (err) {
    console.error('getMyRegistrations error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching registrations.' });
  }
};

/**
 * GET /api/registrations/:id
 * Get a single registration by registrationId string (e.g., INF-2026-0001)
 * Only accessible by the owner or an admin
 */
const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findOne({ registrationId: req.params.id }).populate('eventId');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    // Check ownership or admin access
    const isOwner = registration.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.status(200).json({ success: true, registration });
  } catch (err) {
    console.error('getRegistrationById error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching registration.' });
  }
};

/**
 * PUT /api/registrations/:id/transaction
 * Update transactionId for a registration (owner only)
 */
const updateTransactionId = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId || !transactionId.trim()) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required.' });
    }

    const registration = await Registration.findOne({ registrationId: req.params.id });

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }

    // Only the owner can update transaction ID
    if (registration.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (registration.paymentStatus === 'verified') {
      return res.status(400).json({ success: false, message: 'Payment already verified. Cannot update transaction ID.' });
    }

    registration.transactionId = transactionId.trim();
    await registration.save();

    return res.status(200).json({
      success: true,
      message: 'Transaction ID updated successfully.',
      registration,
    });
  } catch (err) {
    console.error('updateTransactionId error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating transaction ID.' });
  }
};

module.exports = { createRegistration, getMyRegistrations, getRegistrationById, updateTransactionId };
