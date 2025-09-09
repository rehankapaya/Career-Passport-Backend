const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
  resource_id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  file_url: {
    type: String,
    required: true,
  },
  tag: {
    type: [String], // Array of tags
    default: [],
  },
  views_count: {
    type: Number,
    default: 0,
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Set resource_id to _id before saving if not set
resourceSchema.pre('save', function(next) {
  if (!this.resource_id) {
    this.resource_id = this._id.toString();
  }
  next();
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;