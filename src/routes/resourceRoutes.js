const express = require('express');
const {
  addResource,
  getResources,
  getResourceById,
  downloadResource,
  updateResourceTags,
  deleteResource,
  getPopularResources,
  updateResource,
} = require('../controllers/resourceController');
const { protectAdmin, protectUser } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create resource (admin only)
router.post('/', protectAdmin, addResource);

// Get all resources (public, filter by category/tag)
router.get('/', getResources);

// Get single resource (public, for preview)
router.get('/:id', getResourceById);

// Download resource (increments views_count)
router.get('/:id/download', protectUser, downloadResource);

// Update resource tags (admin only)
router.put('/:id/tags', protectAdmin, updateResourceTags);

// Delete resource (admin only)
router.delete('/:id', protectAdmin, deleteResource);

// Get popular resources (admin only)
router.get('/analytics/popular', protectAdmin, getPopularResources);

router.put('/:id', protectAdmin, updateResource);

module.exports = router;