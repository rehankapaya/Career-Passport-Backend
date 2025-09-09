const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect, protectUser } = require('../middlewares/authMiddleware');


router.post('/register', registerUser);
// http://localhost:5000/api/users/register
// {
//     "username": "student1",
//     "email": "student1@example.com",
//     "password": "password123",
//     "role": "Student"
// }

router.post('/login', loginUser);
// http://localhost:5000/api/users/login
// {
//     "email": "student1@example.com",
//     "password": "password123"
// }

router.get('/profile', protectUser, getUserProfile  );
// http://localhost:5000/api/users/profile

module.exports = router;