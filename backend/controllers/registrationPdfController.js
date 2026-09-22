const Registration = require('../models/Registration');
const {
  generateRegistrationPdf,
} = require('../utils/registrationPdf');

const downloadRegistrationPdf = async (
  req,
  res
) => {
  try {
    const registration =
      await Registration.findById(
        req.params.id
      )
        .populate(
          'eventId',
          'name category'
        )
        .lean();

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found.',
      });
    }

    // =================================================
    // ONLY VERIFIED PAYMENT
    // =================================================

    if (
      registration.paymentStatus !==
      'verified'
    ) {
      return res.status(403).json({
        success: false,
        message:
          'PDF download is available only after payment verification.',
      });
    }

    // =================================================
    // USER CAN DOWNLOAD ONLY THEIR OWN REGISTRATION
    // =================================================

    if (
      req.user.role !== 'admin' &&
      String(registration.userId) !==
        String(req.user._id || req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    // =================================================
    // NORMALIZE EVENT DATA
    // =================================================

    if (
      registration.eventId &&
      !registration.events
    ) {
      registration.events =
        Array.isArray(
          registration.eventId
        )
          ? registration.eventId
          : [registration.eventId];
    }

    generateRegistrationPdf(
      registration,
      res
    );
  } catch (error) {
    console.error(
      'PDF download error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Server error generating PDF.',
    });
  }
};

module.exports = {
  downloadRegistrationPdf,
};