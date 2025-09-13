const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword } = require('../controllers/userController');
const { protect, protectUser } = require('../middlewares/authMiddleware');


router.post('/register', registerUser);


router.post('/login', loginUser);

router.get('/profile', protectUser, getUserProfile  );

router.post("/forgot-password",forgotPassword);

router.post("/reset-password",resetPassword);
module.exports = router;