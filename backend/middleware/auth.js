const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * verifyToken middleware
 * Checks Authorization Bearer header, decodes JWT, attaches user to req.user
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. Token missing.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user from DB to ensure they still exist and get latest role
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Token is invalid. User not found.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired. Please login again.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    console.error('Auth middleware error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
  }
};

/**
 * requireAdmin middleware
 * Must be used after verifyToken. Checks user.role === 'admin'
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
  }

  next();
};

module.exports = { verifyToken, requireAdmin };
