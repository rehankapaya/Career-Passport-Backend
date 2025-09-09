const express = require('express');
const router = express.Router();
const { upsertUserProfile, getUserProfile } = require('../controllers/userProfileController');
const { protectUser } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// Create or update profile (with image upload)
router.post('/', protectUser, upload.single('profile_image'), upsertUserProfile);

// Get profile
router.get('/', protectUser, getUserProfile);

module.exports = router;