const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const {
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
} = require('../controllers/adminController');
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

// Apply verifyToken + requireAdmin to ALL routes in this router
router.use(verifyToken, requireAdmin);

// --- Dashboard Stats ---
router.get('/stats', getStats);

// --- Registrations Management ---
router.get('/registrations', getAllRegistrations);
router.get('/registrations/:id', getRegistrationById);
router.put('/registrations/:id', updateRegistration);
router.put('/registrations/:id/payment', updatePaymentStatus);
router.delete('/registrations/:id', deleteRegistration);

// --- User Management ---
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

// --- Settings ---
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// --- Events Management (admin) ---
router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

module.exports = router;
