const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const OTP = require('../models/OTP');
const transporter = require('../config/nodemailerTransporter');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password_hash"); // exclude password
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const registerUser = async (req, res) => {
    const { uname, email, password, role } = req.body;

    console.log(req.body)
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        console.log(userExists)
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


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            const token = generateToken(user._id);
            res.cookie('token', token, {
                maxAge: 30 * 24 * 60 * 60 * 1000
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


const getUserProfile = async (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        const newOTP = new OTP({
            email,
            otp: otpCode,
            expiresAt,
            used: false
        });
        await newOTP.save();

        await transporter.sendMail({
            from: "useaptech1@gmail.com",
            to: email,
            subject: "Password Reset OTP",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>You requested to reset your password. Use the OTP below to proceed:</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; margin: 0; font-size: 32px; letter-spacing: 5px;">${otpCode}</h1>
                    </div>
                    <p>This OTP will expire in 15 minutes.</p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <br>
                    <p>Best regards,<br>Your App Team</p>
                </div>
            `
        });

        res.json({
            message: "OTP sent successfully to your email address.",
            email: email
        });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: "Error occurred while processing your request." });
    }
}


const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    console.log("req.body", req.body)
    try {
        const validOTP = await OTP.findOne({
            email,
            otp,
            used: false,
            expiresAt: { $gt: new Date() }
        });

        if (!validOTP) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        console.log("hashedPassword", hashedPassword)
        await User.findOneAndUpdate(
            { email },
            { password: hashedPassword }
        );

        validOTP.used = true;
        await validOTP.save();

        res.json({ message: "Password reset successfully." });

    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: "Error occurred while resetting password." });
    }
}

module.exports = { registerUser, loginUser, getAllUsers, getUserProfile, forgotPassword, resetPassword };