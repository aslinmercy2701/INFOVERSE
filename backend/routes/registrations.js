const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware/auth');
const {
  createRegistration,
  getMyRegistrations,
  getRegistrationById,
  updateTransactionId,
} = require('../controllers/registrationController');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `ppt-${uniqueSuffix}${ext}`);
  },
});

// File filter: accept only .ppt, .pptx, .pdf
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.ppt', '.pptx', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PPT, PPTX, and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// Multer error handling wrapper
const handleUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Maximum size is 10 MB.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// POST /api/registrations - Create registration (auth required, optional file upload)
router.post('/', verifyToken, handleUpload, createRegistration);

// GET /api/registrations/my - Get current user's registrations
router.get('/my', verifyToken, getMyRegistrations);

// GET /api/registrations/:id - Get registration by registrationId
router.get('/:id', verifyToken, getRegistrationById);

// PUT /api/registrations/:id/transaction - Update transaction ID
router.put('/:id/transaction', verifyToken, updateTransactionId);

module.exports = router;
