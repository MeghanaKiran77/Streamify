const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reply: {
        type: String,
        required: true
    },
    repliedAt: {
        type: Date,
        default: Date.now
    }
});

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    commentedAt: {
        type: Date,
        default: Date.now
    },
    replies: [ReplySchema]
});

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoPath: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Only required when uploading a video
    },
    comments: [CommentSchema],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0
    }
});

// Text index for search functionality
VideoSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Video', VideoSchema);