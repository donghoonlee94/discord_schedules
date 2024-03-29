const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  schedule: { type: String },
  updateAt: { type: String },
});

module.exports = mongoose.model('user', userSchema);
