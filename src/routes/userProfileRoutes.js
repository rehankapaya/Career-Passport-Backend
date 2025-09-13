const express = require('express');
const router = express.Router();
const { upsertUserProfile, getUserProfile, resumeUpload } = require('../controllers/userProfileController');
const { protectUser } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.post('/', protectUser, upload.single('profile_image'), upsertUserProfile);

router.get('/', protectUser, getUserProfile);

router.post("/resume",protectUser,upload.single('resume'),resumeUpload)

module.exports = router;