// middlewares/upload.js
const multer = require('multer');

const {storage} = require('../utils/cloudinary')

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB cap (tune as needed)
});

module.exports = upload;
