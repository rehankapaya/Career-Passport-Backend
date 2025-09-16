const Multimedia = require('../models/Multimedia');
const cloudinary = require('../utils/cloudinary');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const { detectResourceType, parseTags } = require('../utils/mediaHelpers');


const addMultimedia = async (req, res) => {
  try {
    const { title, type, transcript } = req.body;
    const tags = parseTags(req.body.tags);

    let finalUrl = req.body.url?.trim();
    let public_id, resource_type, meta = {};

    if (req.file && req.file.buffer) {
      // Decide resource_type
      resource_type = detectResourceType(req.file.mimetype, req.file.originalname);

      // Good folder naming: multimedia/<resource_type>
      const publicId = `multimedia/${resource_type}/${Date.now()}-${(req.file.originalname || 'file')}`;

      const result = await uploadToCloudinary(req.file.buffer, {
        folder: `multimedia/${resource_type}`,
        resource_type,
        public_id: publicId,
      });

      finalUrl = result.secure_url;
      public_id = result.public_id;

      // pick useful metadata if available
      meta = {
        bytes: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height,
        duration: result.duration,
      };
    }

    if (!finalUrl) {
      return res.status(400).json({ message: 'Either a file or a URL is required' });
    }

    const multimedia = await Multimedia.create({
      title,
      type,
      url: finalUrl,
      public_id,
      resource_type,
      tags,
      transcript: transcript || '',
      ...meta,
    });

    return res.status(201).json(multimedia);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
const getMultimedia = async (req, res) => {
  try {
    const items = await Multimedia.find();
    console.log(items)
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getMultimediaById = async (req, res) => {
  try {
    const item = await Multimedia.findOne({ media_id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    console.log("singlemedia=====================================",item)
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateMultimedia = async (req, res) => {
  try {
    const item = await Multimedia.findOne({ media_id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Not found' });

    const { title, type, url, transcript } = req.body;
    const tags = req.body.tags ? parseTags(req.body.tags) : null;

    // Update simple fields
    if (title !== undefined) item.title = title;
    if (type !== undefined) item.type = type;
    if (transcript !== undefined) item.transcript = transcript;
    if (tags) item.tags = tags;

    // If a new file arrives -> upload to Cloudinary
    if (req.file && req.file.buffer) {
      const resource_type = detectResourceType(req.file.mimetype, req.file.originalname);

      // Choose overwrite vs new:
      // Overwrite if we already had a Cloudinary asset
      const nextPublicId = item.public_id || `multimedia/${resource_type}/${Date.now()}-${(req.file.originalname || 'file')}`;

      const result = await uploadToCloudinary(req.file.buffer, {
        folder: `multimedia/${resource_type}`,
        resource_type,
        public_id: nextPublicId, // overwrites if same id
      });

      // If you prefer "new upload then delete old if different", you can delete here:
      if (item.public_id && item.public_id !== result.public_id) {
        try {
          await cloudinary.uploader.destroy(item.public_id, { resource_type: item.resource_type || 'raw' });
        } catch {}
      }

      // Save new info
      item.url = result.secure_url;
      item.public_id = result.public_id;
      item.resource_type = resource_type;

      item.bytes = result.bytes;
      item.format = result.format;
      item.width = result.width;
      item.height = result.height;
      item.duration = result.duration;
    } else if (url !== undefined) {
      // If switching to an external URL and we had a Cloudinary asset, optionally delete it
      if (item.public_id && /^https?:\/\//i.test(url)) {
        try {
          await cloudinary.uploader.destroy(item.public_id, { resource_type: item.resource_type || 'raw' });
        } catch {}
        item.public_id = undefined;
        item.resource_type = undefined;
        item.bytes = undefined;
        item.format = undefined;
        item.width = undefined;
        item.height = undefined;
        item.duration = undefined;
      }
      item.url = url;
    }

    await item.save();
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const deleteMultimedia = async (req, res) => {
  try {
    const item = await Multimedia.findOne({ media_id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Not found' });

    if (item.public_id) {
      try {
        // IMPORTANT: use the correct resource_type that was saved
        await cloudinary.uploader.destroy(item.public_id, { resource_type: item.resource_type || 'raw' });
      } catch (err) {
        console.error('Cloudinary delete failed:', err?.message);
      }
    }

    await item.deleteOne();
    return res.json({ message: 'Deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const rateMultimedia = async (req, res) => {
  try {
    const { rating } = req.body; 
    const item = await Multimedia.findOne({ media_id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Not found' });

    item.rating_avg = ((item.rating_avg * item.rating_count) + rating) / (item.rating_count + 1);
    item.rating_count += 1;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  addMultimedia,
  getMultimedia,
  getMultimediaById,
  updateMultimedia,
  deleteMultimedia,
  rateMultimedia,
};