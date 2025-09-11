const express = require('express');
const router = express.Router();
const {createFeedback,getAllFeedbacks,getFeedbackById,updateFeedbackStatus,deleteFeedback} = require('../controllers/feedbackController');

// Create feedback
router.post('/', createFeedback);

// Get all feedback
router.get('/', getAllFeedbacks);

// Get feedback by ID
router.get('/:id', getFeedbackById);

// Update feedback status
router.put('/:id/status', updateFeedbackStatus);

// Delete feedback
router.delete('/:id', deleteFeedback);

module.exports = router;
