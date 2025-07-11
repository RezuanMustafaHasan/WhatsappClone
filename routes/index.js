const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');

// Home page
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('index', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Register new user
router.post('/users', async (req, res) => {
  try {
    const { username } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ username });
    
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Create new user
    user = new User({ username });
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get messages between two users
router.get('/messages/:senderId/:receiverId', async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Send message
router.post('/messages', async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    
    const message = new Message({
      sender,
      receiver,
      content
    });
    
    await message.save();
    
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;