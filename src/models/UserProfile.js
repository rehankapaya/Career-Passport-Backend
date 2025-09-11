const mongoose = require('mongoose');

const userProfileSchema = mongoose.Schema({

    profile_id: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // References the User model
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
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

// Set resource_id to _id before saving if not set
userProfileSchema.pre('save', function (next) {
    if (!this.profile_id) {
        this.profile_id = this._id.toString();
    }
    next();
});
const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;