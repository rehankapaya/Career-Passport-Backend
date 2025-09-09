const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function to generate a token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token will expire in 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    // ... (keep the existing registerUser function as is) ...
    const { uname, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ uname, email, password_hash: password, role });

        if (user) {
            res.status(201).json({
                user: { ...user._doc, token: generateToken(user._id) }
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Authenticate a user (login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user by email
        const user = await User.findOne({ email });

        // 2. If user exists, compare passwords
        if (user && (await bcrypt.compare(password, user.password_hash))) {
            const token = generateToken(user._id);
            res.cookie('token', token, {
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });
            console.log("user", user)
            res.json({
                user: { ...user._doc, token }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    // The user object is attached to the request in the `protect` middleware
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };