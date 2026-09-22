const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/admin-login
router.post('/admin-login', adminLogin);

// GET /api/auth/me
router.get('/me', verifyToken, getMe);

module.exports = router;
