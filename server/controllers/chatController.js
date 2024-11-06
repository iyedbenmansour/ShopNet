// controllers/messageController.js

const Message = require('../models/chatModel');

// Create a new message
exports.createMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;
  try {
    const newMessage = await Message.create({ senderId, receiverId, message });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  const { userId1, userId2 } = req.params;
  try {
    const conversation = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ timestamp: 1 });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve conversation' });
  }
};

// Get all messages sent by a user
exports.getMessagesByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Message.find({ senderId: userId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};