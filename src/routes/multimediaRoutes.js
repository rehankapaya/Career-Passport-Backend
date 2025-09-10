const express = require('express');
const router = express.Router();
const {
  addMultimedia,
  getMultimedia,
  getMultimediaById,
  updateMultimedia,
  deleteMultimedia,
  rateMultimedia,
} = require('../controllers/multimediaController');
const { protectAdmin } = require('../middlewares/authMiddleware');

// Add new multimedia (admin only)
router.post('/', protectAdmin, addMultimedia);
// {
//   "title": "How React Works",
//   "type": "video",
//   "url": "https://www.youtube.com/embed/dGcsHMXbSOA",
//   "tags": ["React", "Frontend", "Beginner"],
//   "transcript": "This video explains the basics of React...",
//   "rating_avg": 4.5,
//   "rating_count": 10
// }

// Get all multimedia (public)
router.get('/', getMultimedia);

// Get multimedia by ID (public)
router.get('/:id', getMultimediaById);

// Update multimedia (admin only)
router.put('/:id', protectAdmin, updateMultimedia);

// Delete multimedia (admin only)
router.delete('/:id', protectAdmin, deleteMultimedia);

// Add this to multimediaRoutes.js
router.post('/:id/rate', rateMultimedia); // public or protectUser if needed
// {
//   "rating": 5
// }
module.exports = router;