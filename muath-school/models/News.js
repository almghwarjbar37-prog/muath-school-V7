const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  content:   { type: String, required: true },
  excerpt:   { type: String, default: '' },
  category:  { type: String, enum: ['إنجاز', 'فعالية', 'أكاديمي', 'إعلان', 'أخرى'], default: 'أخرى' },
  image:     { type: String, default: '' },
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

newsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }
  next();
});

module.exports = mongoose.model('News', newsSchema);
