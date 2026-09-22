const Event = require('../models/Event');

/**
 * GET /api/events
 * GET /api/admin/events
 * Return all events (public: only active; admin: all)
 */
const getEvents = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const filter = isAdmin ? {} : { status: 'active' };

    const events = await Event.find(filter).sort({ category: 1, name: 1 });
    return res.status(200).json({ success: true, count: events.length, events });
  } catch (err) {
    console.error('getEvents error:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching events.' });
  }
};

/**
 * GET /api/events/:id
 * Get a single event by MongoDB ObjectId
 */
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    return res.status(200).json({ success: true, event });
  } catch (err) {
    console.error('getEvent error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    return res.status(500).json({ success: false, message: 'Server error fetching event.' });
  }
};

/**
 * POST /api/admin/events
 * Create a new event (admin only)
 */
const createEvent = async (req, res) => {
  try {
    const {
      name, category, description, rules, teamSize,
      mode, fee, date, venue, isTeamEvent, requiresUpload,
      maxParticipants, status,
    } = req.body;

    if (!name || !category || !description || !mode || fee === undefined || !date || !venue) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const event = new Event({
      name, category, description, rules, teamSize,
      mode, fee, date, venue, isTeamEvent, requiresUpload,
      maxParticipants, status,
    });

    await event.save();
    return res.status(201).json({ success: true, message: 'Event created successfully.', event });
  } catch (err) {
    console.error('createEvent error:', err);
    return res.status(500).json({ success: false, message: 'Server error creating event.' });
  }
};

/**
 * PUT /api/admin/events/:id
 * Update an existing event (admin only)
 */
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    return res.status(200).json({ success: true, message: 'Event updated successfully.', event });
  } catch (err) {
    console.error('updateEvent error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    return res.status(500).json({ success: false, message: 'Server error updating event.' });
  }
};

/**
 * DELETE /api/admin/events/:id
 * Delete an event (admin only)
 */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    return res.status(200).json({ success: true, message: 'Event deleted successfully.' });
  } catch (err) {
    console.error('deleteEvent error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    return res.status(500).json({ success: false, message: 'Server error deleting event.' });
  }
};

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent };
