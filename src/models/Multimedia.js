// models/Multimedia.js
const mongoose = require('mongoose');

const multimediaSchema = mongoose.Schema({
  media_id: { type: String, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true }, // 'image' | 'video' | 'audio' | 'document' | etc.
  url: { type: String, required: true },  // Cloudinary secure_url or external URL
  public_id: { type: String },            // Cloudinary public id (if hosted on Cloudinary)
  resource_type: { type: String },        // 'image' | 'video' | 'raw'
  tags: { type: [String], default: [] },
  transcript: { type: String },

  // Optional metadata you might care about
  bytes: Number,
  format: String,
  width: Number,
  height: Number,
  duration: Number,
}, { timestamps: true });

multimediaSchema.pre('save', function(next) {
  if (!this.media_id) this.media_id = this._id.toString();
  next();
});

const Multimedia = mongoose.model('Multimedia', multimediaSchema);
module.exports = Multimedia;
