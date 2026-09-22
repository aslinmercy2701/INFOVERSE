const ContactMessage = require('../models/ContactMessage');

// Send / save contact message
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('Create contact message error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to send message',
    });
  }
};

// Get all messages - Admin
const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error('Get contact messages error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
    });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { status: 'read' },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    console.error('Mark message read error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update message',
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Delete message error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
    });
  }
};

module.exports = {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
};