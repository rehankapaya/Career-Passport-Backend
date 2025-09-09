const express = require('express');
const { authAdmin, createAdmin, addCareerProfile } = require('../controllers/adminController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Public route for admin login
router.post('/login', authAdmin);
router.post('/create', createAdmin);

// Future protected routes for admin actions can be added here
// For example: router.post('/careers', protect, createCareer);
router.get('/add-career', protectAdmin, addCareerProfile);
module.exports = router;