const express = require('express');
const router = express.Router();
const { validateReferral } = require('../controllers/referralController');
const { verifyToken } = require('../middleware/auth');

// POST /api/referral/validate
// verifyToken is optional here — controller handles both cases
router.post('/validate', verifyToken, validateReferral);

module.exports = router;
