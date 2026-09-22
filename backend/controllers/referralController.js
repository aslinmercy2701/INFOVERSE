const ReferralCode = require('../models/ReferralCode');
const Registration = require('../models/Registration');

/**
 * POST /api/referral/validate
 * Validate a referral code before applying it
 * Body: { code, currentUserRegistrationId }
 */
const validateReferral = async (req, res) => {
  try {
    const { code, currentUserRegistrationId } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ valid: false, message: 'Referral code is required.' });
    }

    const trimmedCode = code.trim().toUpperCase();

    // Check if code exists
    const referralCodeDoc = await ReferralCode.findOne({ code: trimmedCode });
    if (!referralCodeDoc) {
      return res.status(200).json({ valid: false, discount: 0, message: 'Invalid referral code.' });
    }

    // Check if already used
    if (referralCodeDoc.isUsed) {
      return res.status(200).json({ valid: false, discount: 0, message: 'This referral code has already been used.' });
    }

    // Check that user is not using their own referral code
    if (req.user) {
      const generatingReg = await Registration.findOne({
        registrationId: referralCodeDoc.generatedByRegistrationId,
      });
      if (generatingReg && generatingReg.userId.toString() === req.user._id.toString()) {
        return res.status(200).json({
          valid: false,
          discount: 0,
          message: 'You cannot use your own referral code.',
        });
      }
    }

    // Also check via currentUserRegistrationId if provided
    if (currentUserRegistrationId) {
      if (referralCodeDoc.generatedByRegistrationId === currentUserRegistrationId) {
        return res.status(200).json({
          valid: false,
          discount: 0,
          message: 'You cannot use your own referral code.',
        });
      }
    }

    return res.status(200).json({
      valid: true,
      discount: referralCodeDoc.discountAmount || 10,
      message: `Referral code applied! You save ₹${referralCodeDoc.discountAmount || 10}.`,
    });
  } catch (err) {
    console.error('validateReferral error:', err);
    return res.status(500).json({ valid: false, message: 'Server error validating referral code.' });
  }
};

module.exports = { validateReferral };
