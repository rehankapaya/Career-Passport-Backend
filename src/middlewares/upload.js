const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profile_image") {
      cb(null, "uploads/profile_images/");
    } else if (file.fieldname === "image_url") {
      cb(null, "uploads/success_story_images/");
    } else if (file.fieldname === "file") {
      cb(null, "uploads/multimedia/");
    } else if (file.fieldname === "resume") {
      cb(null, "uploads/resume/");
    } else {
      cb(null, "uploads/other/");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });

module.exports = upload;