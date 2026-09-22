const express = require('express');
const router = express.Router();
const { getEvents, getEvent } = require('../controllers/eventController');

// GET /api/events - Public: returns active events only
router.get('/', getEvents);

// GET /api/events/:id - Public: get single event by ID
router.get('/:id', getEvent);

module.exports = router;
