// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema); // Modelo baseado no schema

module.exports = User;
