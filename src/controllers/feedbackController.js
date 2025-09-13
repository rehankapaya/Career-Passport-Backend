const Feedback = require('../models/Feedback');


const createFeedback = async (req, res) => {
    const { category, message } = req.body;

    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, no user found' });
        }

        if (!category || !message) {
            return res.status(400).json({ message: 'Category and message are required.' });
        }

        const feedback = await Feedback.create({
            user_id: req.user._id,
            category,
            message,
        });

        if (feedback) {
            res.status(201).json({
                success: true,
                message: 'Feedback submitted successfully',
                data: feedback,
            });
        } else {
            res.status(400).json({ message: 'Invalid feedback data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('user_id', 'uname email');
        res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id).populate('user_id', 'uname email');

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.status(200).json({ success: true, data: feedback });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const updateFeedbackStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Feedback status updated successfully',
            data: feedback,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Feedback deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createFeedback,
    getAllFeedbacks,
    getFeedbackById,
    updateFeedbackStatus,
    deleteFeedback,
};
