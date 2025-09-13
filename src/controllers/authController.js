// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Admin = require('../models/Admin');

const signToken = (id, role) =>
  jwt.sign({ sub: id.toString(), role, typ: 'auth' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/',
};

exports.loginAny = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1) Find account (prefer Admin first; flip if you prefer Users)
    let account = await Admin.findOne({ email });
    let role = 'admin';

    if (!account) {
      account = await User.findOne({ email });
      console.log(account)
      role = 'user';
    }

    if (!account) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2) Verify password
    const ok = await bcrypt.compare(password, account.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3) Create token + set cookie
    const token = signToken(account._id, role);
    res.cookie('token', token, cookieOpts);

    // 4) Unified success payload
    return res.json({
      id: account._id,
      name: account.name || account.uname || account.fullName || null,
      email: account.email,
      role,     // 'admin' or 'user'
      token,    // also returned for non-cookie clients
    });

  } catch (err) {
    console.error('loginAny error:', err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
