const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { protectUser, protectAdmin } = require('../middlewares/authMiddleware');
const {
  addSuccessStory,
  getSuccessStories,
  getSuccessStoryById,
  approveSuccessStory,
  deleteSuccessStory,
} = require('../controllers/successStoriesController');

// Create a new success story (user, with image upload)
router.post('/', protectUser, upload.single('image_url'), addSuccessStory);

// Get all success stories (public)
router.get('/', getSuccessStories);

// Get a single story by ID (public)
router.get('/:id', getSuccessStoryById);

// Approve a story (admin only)
router.put('/:id/approve', protectAdmin, approveSuccessStory);

// Delete a story (admin only)
router.delete('/:id', protectAdmin, deleteSuccessStory);

module.exports = router;