const UserProfile = require('../models/UserProfile');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const path = require("path");
const { v2: cloudinary } = require("cloudinary");

// POST /api/user-profile  (profile_image optional)
const upsertUserProfile = async (req, res) => {
  try {
    const { education_level, interests } = req.body;
    const user_id = req.user._id;

    // Parse interests (accepts JSON string, single string, or array)
    let parsedInterests = interests;
    if (typeof interests === 'string') {
      try { parsedInterests = JSON.parse(interests); }
      catch { parsedInterests = [interests]; }
    }

    // Find (or create later) user profile
    let profile = await UserProfile.findOne({ user_id });

    // If a new profile image file is provided, upload to Cloudinary
    let newImageUrl, newImagePublicId;
    if (req.file && req.file.buffer) {
      // TIP: name by user to replace previous versions cleanly
      // If you prefer unique names, use `${user_id}-${Date.now()}`
      const publicId = `user/profile_images/${user_id}`;

      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'user/profile_images',
        resource_type: 'image',
        public_id: publicId, // overwrite same public_id for same user
      });

      newImageUrl = result.secure_url;
      newImagePublicId = result.public_id;
    }

    // Upsert logic
    if (profile) {
      if (education_level !== undefined) profile.education_level = education_level;
      if (parsedInterests !== undefined) profile.interests = parsedInterests;

      if (newImageUrl) {
        // OPTIONAL: if you used unique public_ids before, you can delete the old one.
        // Only do this if you're not overwriting the same public_id.
        if (profile.profile_image_id && profile.profile_image_id !== newImagePublicId) {
          try { await cloudinary.uploader.destroy(profile.profile_image_id); } catch (_) {}
        }

        profile.profile_image = newImageUrl;
        profile.profile_image_id = newImagePublicId; // store public_id too
      }

      profile.updated_at = Date.now();
      await profile.save();
    } else {
      profile = await UserProfile.create({
        user_id,
        education_level,
        interests: parsedInterests,
        profile_image: newImageUrl,       // may be undefined if no file sent
        profile_image_id: newImagePublicId,
      });
    }

    // Return the saved doc
    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// POST /api/user-profile/resume  (resume required)
const resumeUpload = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user_id = req.user._id;

    // 🔑 Get the real extension from the original file name (pdf, docx, etc.)
    const ext = path.extname(req.file.originalname || "").toLowerCase(); // e.g. ".pdf"
    const safeExt = ext ? ext : ""; // fallback to empty if none

    // Build a stable public_id that *includes* the extension so Cloudinary URL ends with it
    const publicId = `user/resumes/${user_id}${safeExt}`;

    // Upload to Cloudinary as raw file
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "user/resumes",
      resource_type: "raw",
      public_id: publicId,        // <-- contains extension now
      overwrite: true,            // replace old version if same id
      invalidate: true,           // bust CDN cache if updated
    });

    const resumeUrl = result.secure_url;
    const resumePublicId = result.public_id; // will include extension now, e.g. "user/resumes/12345.pdf"

    // Upsert user profile
    let profile = await UserProfile.findOne({ user_id });
    if (profile) {
      // optional: delete old file if we changed the id format
      if (profile.resume_id && profile.resume_id !== resumePublicId) {
        try {
          await cloudinary.uploader.destroy(profile.resume_id, { resource_type: "raw" });
        } catch (_) {}
      }
      profile.resume = resumeUrl;
      profile.resume_id = resumePublicId;
      profile.resume_ext = safeExt.replace(".", ""); // store extension separately if you want
      profile.updated_at = Date.now();
      await profile.save();
    } else {
      profile = await UserProfile.create({
        user_id,
        resume: resumeUrl,
        resume_id: resumePublicId,
        resume_ext: safeExt.replace(".", ""), // optional
      });
    }

    res.json({
      message: "Resume uploaded successfully",
      url: resumeUrl,
      public_id: resumePublicId,
      ext: safeExt.replace(".", ""), // return extension to frontend if needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user_id = req.user._id;
    const profile = await UserProfile.findOne({ user_id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { upsertUserProfile, getUserProfile, resumeUpload };
