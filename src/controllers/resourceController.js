const Resource = require('../models/Resource');

// Create a new resource (admin only)
const addResource = async (req, res) => {
  const { title, category, description, file_url, tag } = req.body;
  if (!title || !category || !description || !file_url ) {
    return res.status(400).json({ message: 'All required fields must be provided.' });
  }
  try {
    const resource = await Resource.create({
      title,
      category,
      description,
      file_url,
      tag,
      created_by:req.admin._id,
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all resources (grouped by category or tag)
const getResources = async (req, res) => {
  try {
    const { category, tag } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (tag) filter.tag = tag;
    const resources = await Resource.find(filter).populate('created_by', 'uname email');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single resource (for preview, modal, etc.)
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findOne({ resource_id: req.params.id }).populate('created_by', 'uname email');
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Download resource (increments views_count)
const downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findOne({ resource_id: req.params.id });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    resource.views_count += 1;
    await resource.save();
    res.json({ file_url: resource.file_url });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update resource tags (admin only)
const updateResourceTags = async (req, res) => {
  try {
    const resource = await Resource.findOne({ resource_id: req.params.id });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    resource.tag = req.body.tag || resource.tag;
    await resource.save();
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete resource (admin only)
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({ resource_id: req.params.id });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin analytics: get most popular resources
const getPopularResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ views_count: -1 }).limit(10);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addResource,
  getResources,
  getResourceById,
  downloadResource,
  updateResourceTags,
  deleteResource,
  getPopularResources,
};