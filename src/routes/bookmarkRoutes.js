const express = require('express');
const router = express.Router();
const { protectUser } = require('../middlewares/authMiddleware');
const controller = require('../controllers/bookmarkController');


router.get("/admin/all", controller.getAllBookmarks);
router.use(protectUser);

router.post('/', controller.createOrRemove);

router.get('/', controller.list);

router.get('/check', controller.isBookmarked);

router.delete('/:id', controller.removeById);

module.exports = router;
