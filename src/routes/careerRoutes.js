const express = require('express');
const { addCareer, getCareers, getCareerById, updateCareer, deleteCareer } = require('../controllers/careerController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

// Add a new career (admin only)
router.post('/', protectAdmin, addCareer);
// sample data to add a career profile
// {
//   "title": "Software Engineer",
//   "description": "Designs, develops, and maintains software applications.",
//   "domain": "Information Technology",
//   "required_skills": ["Programming", "Problem Solving", "Algorithms", "Teamwork"],
//   "education_path": "Bachelor's degree in Computer Science or related field",
//   "expected_salary": 85000
// }
// Get all careers (public)


router.get('/', getCareers);

// Get a career by ID (public)
router.get('/:id', getCareerById);


// Update a career (admin only)
router.put('/:id', protectAdmin, updateCareer);

// Delete a career (admin only)
router.delete('/:id', protectAdmin, deleteCareer);

module.exports = router;