const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Create feedback
router.post('/', feedbackController.createFeedback);

// Get all feedback
router.get('/', feedbackController.getAllFeedbacks);

// Get feedback by ID
router.get('/:id', feedbackController.getFeedbackById);

// Update feedback status
router.put('/:id/status', feedbackController.updateFeedbackStatus);

// Delete feedback
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
