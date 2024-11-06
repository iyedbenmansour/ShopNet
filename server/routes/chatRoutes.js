// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/chatController');

// Route to send a new message
router.post('/messages', messageController.createMessage);

// Route to get conversation between two users
router.get('/messages/:userId1/:userId2', messageController.getConversation);

// Route to get all messages sent by a user
router.get('/messages/user/:userId', messageController.getMessagesByUser);

module.exports = router;