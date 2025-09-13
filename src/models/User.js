const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  user_id: {
    type: String,
    unique: true,
  },
  uname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'graduate', 'professional'],
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.user_id) {
    this.user_id = this._id.toString();
  }
  if (!this.isModified('password_hash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;