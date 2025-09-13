const express = require('express');
const { addCareer, getCareers, getCareerById, updateCareer, deleteCareer } = require('../controllers/careerController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protectAdmin, addCareer);

router.get('/', getCareers);

router.get('/:id', getCareerById);

router.put('/:id', protectAdmin, updateCareer);

router.delete('/:id', protectAdmin, deleteCareer);

module.exports = router;