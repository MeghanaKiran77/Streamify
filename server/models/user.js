const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Additional profile fields
    bio: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('User', UserSchema);
