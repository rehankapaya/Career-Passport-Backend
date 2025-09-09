const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = mongoose.Schema({
  name: {
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
}, {
  timestamps: true,
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;