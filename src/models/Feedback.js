const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
  feedback_id: {
    type: String,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User collection
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['bug', 'feature', 'general', 'other'], // you can adjust categories as needed
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'reviewed', 'resolved'],
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Set feedback_id to _id before saving if not set
feedbackSchema.pre('save', function (next) {
  if (!this.feedback_id) {
    this.feedback_id = this._id.toString();
  }
  next();
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
