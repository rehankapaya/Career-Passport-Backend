// utils/uploadToCloudinary.js
const streamifier = require('streamifier');
const cloudinary = require('./cloudinary');

function uploadToCloudinary(fileBuffer, {
  folder,
  resource_type = 'image', // 'image' | 'raw' | 'video' | 'auto'
  public_id,               // optional: let Cloudinary name it if omitted
}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type, public_id },
      (error, result) => (error ? reject(error) : resolve(result))
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

module.exports = uploadToCloudinary;
