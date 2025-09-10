const mongoose = require('mongoose');

const multimediaSchema = mongoose.Schema({
  media_id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true, // e.g. 'video', 'audio', 'image', 'pdf'
  },
  url: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  transcript: {
    type: String,
  },
  rating_avg: {
    type: Number,
    default: 0,
  },
  rating_count: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Set media_id to _id before saving if not set
multimediaSchema.pre('save', function(next) {
  if (!this.media_id) {
    this.media_id = this._id.toString();
  }
  next();
});

const Multimedia = mongoose.model('Multimedia', multimediaSchema);
module.exports = Multimedia;