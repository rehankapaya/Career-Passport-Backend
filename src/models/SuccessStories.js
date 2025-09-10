const mongoose = require('mongoose');

const successStorySchema = mongoose.Schema({
  story_id: {
    type: String,
    unique: true,
  },
  rname: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  story_text: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
  },
  submitted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  approved_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  approved_at: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Set story_id to _id before saving if not set
successStorySchema.pre('save', function(next) {
  if (!this.story_id) {
    this.story_id = this._id.toString();
  }
  next();
});

const SuccessStory = mongoose.model('SuccessStory', successStorySchema);
module.exports = SuccessStory;