const mongoose = require('mongoose');
const { Schema } = mongoose;

const communitySchema = new Schema({
  _id: String,
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  owner: { type: String, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Community', communitySchema);
