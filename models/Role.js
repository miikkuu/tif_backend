const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
  _id: String,
  name: { type: String, unique: true, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', roleSchema);
