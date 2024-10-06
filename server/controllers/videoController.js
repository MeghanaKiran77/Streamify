const Video = require('../models/Video');
const path = require('path');
const fs = require('fs');

exports.uploadVideo = async (req, res) => {
    const { title, description } = req.body;
    const videoPath = req.file.filename;
    const uploadedBy = req.user.id;

    console.log("Upload Video: Start"); // Log start of the function
    console.log(`Title: ${title}`);
    console.log(`Description: ${description}`);
    console.log(`Video Path: ${videoPath}`);
    console.log(`Uploaded By: ${uploadedBy}`);

    try {
        const newVideo = new Video({
            title,
            description,
            videoPath,
            uploadedBy
        });

        await newVideo.save();
        console.log("Video uploaded successfully");
        res.status(201).json(newVideo);
    } catch (err) {
        console.error("Server error:", err.message);
        res.status(500).send('Server error');
    }
};

exports.getVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate('uploadedBy', 'username');
        res.status(200).json(videos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getVideo = async (req, res) => {
    console.log('Fetching video with ID:', req.params.id);
    try {
        if (!req.params.id) {
            return res.status(404).json({ msg: 'Video ID not provided' });
        }

        const video = await Video.findById(req.params.id).populate('uploadedBy', 'username');
        console.log('Video data:', video);  // Log the video object

        if (!video) {
            return res.status(404).json({ msg: 'Video not found' });
        }

        if (!video.videoPath) {
            return res.status(404).json({ msg: 'Video path not found in database' });
        }

        const fullPath = path.join(__dirname, '..', 'uploads', video.videoPath);
        console.log('Full video path:', fullPath);  // Log the full path

        if (fs.existsSync(fullPath)) {
            return res.sendFile(fullPath);
        } else {
            return res.status(404).json({ msg: 'Video file not found on server' });
        }

    } catch (err) {
        console.error('Server error:', err.message);
        return res.status(500).send('Server error');
    }
};

// Fetch videos uploaded by a user
exports.getVideosByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Ensure the userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const videos = await Video.find({ uploadedBy: userId }).populate('uploadedBy', 'username');
        if (!videos || videos.length === 0) {
            return res.status(404).json({ message: 'No videos found for this user' });
        }
        res.status(200).json(videos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        fs.unlinkSync(path.join(__dirname, '..', 'uploads', video.videoPath));
        await video.remove();
        res.json({ message: 'Video deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

exports.commentOnVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        video.comments.push({ userId: req.user.id, comment: req.body.comment });
        await video.save();
        res.json(video);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

exports.likeVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        if (!video.likes.includes(req.user.id)) {
            video.likes.push(req.user.id);
            await video.save();
        }
        res.json(video);
    } catch (err) {
        res.status (500).json({ message: 'Internal server error', error: err.message });
    }
};

exports.searchVideos = async (req, res) => {
    try {
        const query = req.params.query;
        const videos = await Video.find({ $text: { $search: query } });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

exports.trackViews = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        video.views = (video.views || 0) + 1;
        await video.save();
        res.json(video);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

// Endpoint for downloading a video
exports.downloadVideo = (req, res) => {
    const fileId = req.params.fileId;
    const filePath = path.join(__dirname, '..', 'uploads', fileId);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ message: 'File not found' });
    }
};

// Reply to a comment on a video
exports.replyToComment = async (req, res) => {
    console.log("Reply to Comment: Start"); // Log start of the function
    const videoId = req.params.videoId;
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const reply = req.body.reply;

    console.log(`Video ID: ${videoId}`);
    console.log(`Comment ID: ${commentId}`);
    console.log(`User ID: ${userId}`);
    console.log(`Reply: ${reply}`);

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            console.log("Video not found");
            return res.status(404).json({ message: 'Video not found' });
        }

        const comment = video.comments.id(commentId);
        if (!comment) {
            console.log("Comment not found");
            return res.status(404).json({ message: 'Comment not found' });
        }

        comment.replies.push({ userId: userId, reply: reply });
        await video.save();

        console.log("Reply added successfully");
        res.json(video);
    } catch (err) {
        console.error("Internal server error:", err.message);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};