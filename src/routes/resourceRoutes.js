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

router.post('/', protectAdmin, addResource);

router.get('/', getResources);

router.get('/:id', getResourceById);

router.get('/:id/download', protectUser, downloadResource);

router.put('/:id/tags', protectAdmin, updateResourceTags);

router.delete('/:id', protectAdmin, deleteResource);

router.get('/analytics/popular', protectAdmin, getPopularResources);

router.put('/:id', protectAdmin, updateResource);

module.exports = router;