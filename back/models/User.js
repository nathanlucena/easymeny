// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema); 

async function findUserByPhone(phone) {
  try {
    const userFind = await User.findOne({ phone: phone });
    return userFind;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}


module.exports = { User, findUserByPhone };