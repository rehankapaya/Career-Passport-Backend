const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
  feedback_id: {
    type: String,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['bug', 'feature', 'general', 'other'], 
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

feedbackSchema.pre('save', function (next) {
  if (!this.feedback_id) {
    this.feedback_id = this._id.toString();
  }
  next();
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
