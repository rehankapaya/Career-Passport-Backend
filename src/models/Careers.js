const mongoose = require('mongoose');

const careerSchema = mongoose.Schema({
  career_id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  required_skills: {
    type: [String], // Array of skills
    required: true,
  },
  education_path: {
    type: String,
    required: true,
  },
  expected_salary: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Set career_id to _id before saving if not set
careerSchema.pre('save', function(next) {
  if (!this.career_id) {
    this.career_id = this._id.toString();
  }
  next();
});

const Career = mongoose.model('Career', careerSchema);
module.exports = Career;