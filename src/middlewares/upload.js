const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store profile images and success story images in different folders
    if (file.fieldname === "profile_image") {
      cb(null, "uploads/profile_images/");
    } else if (file.fieldname === "image_url") {
      cb(null, "uploads/success_story_images/");
    } else {
      cb(null, "uploads/other/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

module.exports = upload;