const Multimedia = require('../models/Multimedia');

// Add new multimedia
const addMultimedia = async (req, res) => {
  try {
    const { title, type, url, tags, transcript } = req.body;
    const multimedia = await Multimedia.create({
      title,
      type,
      url,
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      transcript,
    });
    res.status(201).json(multimedia);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get all multimedia
const getMultimedia = async (req, res) => {
  try {
    const items = await Multimedia.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get multimedia by ID
const getMultimediaById = async (req, res) => {
  try {
    const item = await Multimedia.findOne({ media_id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update multimedia
const updateMultimedia = async (req, res) => {
  try {
    const { title, type, url, tags, transcript } = req.body;
    const item = await Multimedia.findOne({ media_id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Not found' });

    item.title = title || item.title;
    item.type = type || item.type;
    item.url = url || item.url;
    item.tags = Array.isArray(tags) ? tags : tags ? [tags] : item.tags;
    item.transcript = transcript || item.transcript;

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete multimedia
const deleteMultimedia = async (req, res) => {
  try {
    const item = await Multimedia.findOneAndDelete({ media_id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Add this to multimediaController.js
const rateMultimedia = async (req, res) => {
  try {
    const { rating } = req.body; // rating: 1-5 or 0/1 for thumbs
    const item = await Multimedia.findOne({ media_id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Not found' });

    // Update rating average and count
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