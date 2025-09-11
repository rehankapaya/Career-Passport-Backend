const express = require('express');
const router = express.Router();
const { protectUser } = require('../middlewares/authMiddleware');
const controller = require('../controllers/bookmarkController');

router.use(protectUser);

// Toggle create/remove
router.post('/', controller.createOrRemove);

// List all for user (optional ?type=multimedia|career|resource|story)
router.get('/', controller.list);

// Check if one is bookmarked (?itemType=&itemId=)
router.get('/check', controller.isBookmarked);

// Remove by bookmark id
router.delete('/:id', controller.removeById);

module.exports = router;
