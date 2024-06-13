const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: String,
  name: { type: String, default: null },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
