const UserProfile = require('../models/UserProfile');

// Create or update user profile
const upsertUserProfile = async (req, res) => {
  try {
    const { education_level, interests } = req.body;
    const profile_image = req.file ? req.file.path : undefined;
    const user_id = req.user._id;

    // Parse interests if it's a stringified array
    let parsedInterests = interests;
    if (typeof interests === 'string') {
      try {
        parsedInterests = JSON.parse(interests);
      } catch {
        parsedInterests = [interests];
      }
    }

    let profile = await UserProfile.findOne({ user_id });

    if (profile) {
      profile.education_level = education_level || profile.education_level;
      profile.interests = parsedInterests || profile.interests;
      if (profile_image) profile.profile_image = profile_image;
      profile.updated_at = Date.now();
      await profile.save();
    } else {
      profile = await UserProfile.create({
        user_id,
        education_level,
        interests: parsedInterests,
        profile_image,
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const resumeUpload = async (req, res) => {
  try {
    const resume = req.file ? req.file.path : undefined;
    const user_id = req.user._id;

    if (!resume) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // File uploaded successfully
    let profile = await UserProfile.findOne({ user_id });

    if (profile) {
      if (resume) profile.resume = resume;
      profile.updated_at = Date.now();
      await profile.save();
    } else {
      profile = await UserProfile.create({
        user_id,
        resume,
      });
    }
    res.json({ message: 'Resume uploaded successfully', file: req.file });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user_id = req.user._id;
    const profile = await UserProfile.findOne({ user_id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { upsertUserProfile, getUserProfile,resumeUpload };