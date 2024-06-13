const mongoose = require('mongoose');
const { Schema } = mongoose;

const memberSchema = new Schema({
  _id: String,
  community: { type: String, required:true , ref: 'Community' },
  user: { type: String,required:true, ref: 'User' },
  role: { type: String,required:true, ref: 'Role' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', memberSchema);
