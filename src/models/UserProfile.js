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