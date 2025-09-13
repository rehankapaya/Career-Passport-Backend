const express = require('express');
const { authAdmin, createAdmin, addCareerProfile } = require('../controllers/adminController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', authAdmin);
router.post('/create', createAdmin);

router.get('/add-career', protectAdmin, addCareerProfile);
module.exports = router;