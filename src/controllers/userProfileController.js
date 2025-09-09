const UserProfile = require('../models/UserProfile');

// Create or update user profile
const upsertUserProfile = async (req, res) => {
  try {
    const { education_level, interests } = req.body;
    const profile_image = req.file ? req.file.path : undefined;
    const user_id = req.user._id;

    console.log('req.file:', req.file);
    let profile = await UserProfile.findOne({ user_id });

    if (profile) {
      // Update existing profile
      profile.education_level = education_level || profile.education_level;
      profile.interests = interests || profile.interests;
      if (profile_image) profile.profile_image = profile_image;
      profile.updated_at = Date.now();
      await profile.save();
    } else {
      // Create new profile
      profile = await UserProfile.create({
        user_id,
        education_level,
        interests,
        profile_image,
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

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

module.exports = { upsertUserProfile, getUserProfile };