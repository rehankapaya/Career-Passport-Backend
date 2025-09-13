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
const upload = require('../middlewares/upload');

router.post('/', protectAdmin,upload.single('file'), addMultimedia);

router.get('/', getMultimedia);

router.get('/:id', getMultimediaById);

router.put('/:id', protectAdmin, upload.single('file'), updateMultimedia);

router.delete('/:id', protectAdmin, deleteMultimedia);

router.post('/:id/rate', rateMultimedia); 
module.exports = router;