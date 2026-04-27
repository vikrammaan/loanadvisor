const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sessionId: String,
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Chat', chatSchema);
