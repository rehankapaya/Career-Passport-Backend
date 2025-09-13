const Multimedia = require('../models/Multimedia');

const addMultimedia = async (req, res) => {
  try {
    const { title, type, tags, transcript } = req.body;
    let finalUrl = req.body.url;
    console.log(req.file);
    console.log(req.body);
    console.log(req.body.url);

    if (req.file) {
      finalUrl = `uploads/multimedia/${req.file.filename}`;
    }

    if (!finalUrl && !req.file) {
      return res.status(400).json({ message: 'Either URL or file is required' });
    }

    const multimedia = await Multimedia.create({
      title,
      type,
      url: finalUrl,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      transcript: transcript || '',
    });
    
    res.status(201).json(multimedia);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
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
  console.log(req.body);
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

const deleteMultimedia = async (req, res) => {
  try {
    const item = await Multimedia.findOneAndDelete({ media_id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
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