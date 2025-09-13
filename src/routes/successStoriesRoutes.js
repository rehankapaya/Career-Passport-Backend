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

router.post('/', protectUser, upload.single('image_url'), addSuccessStory);

router.get('/', getSuccessStories);

router.get('/pending',  getPendingSuccessStories);

router.get('/:id', getSuccessStoryById);

router.put('/:id/approve', protectAdmin, approveSuccessStory);

router.delete('/:id/reject', protectAdmin, rejectSuccessStory);

router.delete('/:id', protectAdmin, deleteSuccessStory);


module.exports = router;