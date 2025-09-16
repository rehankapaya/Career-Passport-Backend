const mongoose = require('mongoose');

const userProfileSchema = mongoose.Schema({

    profile_id: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    education_level: {
        type: String,
    },
    interests: [{
        type: String,
    }],
    profile_image: {
        type: String,
    },
    resume: {
        type: String,
    },
    resume_id: { type: String },
    resume_name: String,   // e.g., "MyCV"
    resume_ext: String,    // e.g., "pdf"
    resume_mime: String,   // e.g., "application/pdf"
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

userProfileSchema.pre('save', function (next) {
    if (!this.profile_id) {
        this.profile_id = this._id.toString();
    }
    next();
});
const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;