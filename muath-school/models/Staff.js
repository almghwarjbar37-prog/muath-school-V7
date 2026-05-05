const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  role:  { type: String, required: true, trim: true },
  dept:  { type: String, enum: ['admin', 'btec', 'teaching'], default: 'teaching' },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', staffSchema);
