const SuccessStory = require('../models/SuccessStories');
const cloudinary = require('../utils/cloudinary');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

const addSuccessStory = async (req, res) => {
  try {
    const { rname, domain, story_text } = req.body;
    const submitted_by = req.user._id;

    let image_url, image_public_id;

    // If a file is attached, push it to Cloudinary (as an image)
    if (req.file && req.file.buffer) {
      const publicId = `stories/${submitted_by}-${Date.now()}`; // unique & traceable
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'stories',
        resource_type: 'image',
        public_id: publicId,
      });

      image_url = result.secure_url;
      image_public_id = result.public_id;
    }

    const story = await SuccessStory.create({
      rname,
      domain,
      story_text,
      image_url,        // may be undefined if no file
      image_public_id,  // may be undefined if no file
      submitted_by,
    });

    return res.status(201).json(story);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getSuccessStories = async (req, res) => {
    try {
        const stories = await SuccessStory.find({ approved_at: { $ne: null } })
            .populate('submitted_by', 'uname email');
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getSuccessStoryById = async (req, res) => {
    console.log(req.params.id)
    try {
        const story = await SuccessStory.findOne({ story_id: req.params.id }).populate('submitted_by', 'uname email');
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        res.json(story);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getPendingSuccessStories = async (req, res) => {
    try {
        const stories = await SuccessStory.find({ approved_at: null })
            .populate('submitted_by', 'uname email');
        console.log(stories)
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const approveSuccessStory = async (req, res) => {
    try {
        const story = await SuccessStory.findOne({ story_id: req.params.id });
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        story.approved_by = req.admin._id;
        story.approved_at = new Date();
        await story.save();
        res.json(story);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteSuccessStory = async (req, res) => {
  try {
    // Find the story first so we know its Cloudinary ID
    const story = await SuccessStory.findOne({ story_id: req.params.id });
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Delete the Cloudinary image if present
    if (story.image_public_id) {
      try {
        await cloudinary.uploader.destroy(story.image_public_id, { resource_type: 'image' });
      } catch (err) {
        // log the error but continue deleting the DB record
        console.error('Cloudinary delete failed:', err.message);
      }
    }

    // Remove the document from MongoDB
    await story.deleteOne();

    return res.json({ message: 'Story and image deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
const rejectSuccessStory = async (req, res) => {
    try {
        const story = await SuccessStory.findOne({ story_id: req.params.id });
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        await story.deleteOne();
        res.json({ message: 'Story rejected and deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    addSuccessStory,
    getSuccessStories,
    getSuccessStoryById,
    approveSuccessStory,
    deleteSuccessStory,
    rejectSuccessStory,
    getPendingSuccessStories,
};