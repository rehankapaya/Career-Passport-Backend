const SuccessStory = require('../models/SuccessStories');

const addSuccessStory = async (req, res) => {
    try {
        const { rname, domain, story_text } = req.body;
        const image_url = req.file ? req.file.path : undefined;
        const submitted_by = req.user._id;

        const story = await SuccessStory.create({
            rname,
            domain,
            story_text,
            image_url,
            submitted_by,
        });

        res.status(201).json(story);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
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
        const story = await SuccessStory.findOneAndDelete({ story_id: req.params.id });
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        res.json({ message: 'Story deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
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