const express = require('express');
const router = express.Router();

const {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} = require('../controllers/contactController');

const {
  verifyToken,
  requireAdmin,
} = require('../middleware/auth');

router.post('/', createMessage);

router.get('/messages', verifyToken, requireAdmin, getMessages);

router.put('/messages/:id/read', verifyToken, requireAdmin, markAsRead);

router.delete('/messages/:id', verifyToken, requireAdmin, deleteMessage);

module.exports = router;