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
  getPendingSuccessStories,
  rejectSuccessStory,
} = require('../controllers/successStoriesController');

// Create a new success story (user, with image upload)
router.post('/', protectUser, upload.single('image_url'), addSuccessStory);

// Get all success stories (public)
router.get('/', getSuccessStories);

router.get('/pending',  getPendingSuccessStories);

router.get('/:id', getSuccessStoryById);

// Approve a story (admin only)
router.put('/:id/approve', protectAdmin, approveSuccessStory);

// Reject a story (admin only)
router.delete('/:id/reject', protectAdmin, rejectSuccessStory);

// Delete a story (admin only)
router.delete('/:id', protectAdmin, deleteSuccessStory);


// Get all pending stories (admin only)


module.exports = router;