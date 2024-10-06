const express = require('express');
const router = express.Router();
const { uploadVideo, getVideos, getVideo, getVideosByUser, downloadVideo, deleteVideo, commentOnVideo, replyToComment, likeVideo, searchVideos, trackViews } = require('../controllers/videoController');
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Set up storage with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

router.post('/upload', auth, upload.single('video'), uploadVideo);
router.get('/', getVideos);
router.get('/:id', getVideo);
router.get('/user', auth, getVideosByUser);
// Download video routes
router.get('/download/:fileId', downloadVideo);

// Delete video
router.delete('/:videoId', auth, deleteVideo);

// Comment on a video
router.post('/:videoId/comments', auth, commentOnVideo);

// Reply to a comment
router.post('/:videoId/comments/:commentId/replies', auth, replyToComment);

// Like a video
router.post('/:videoId/likes', auth, likeVideo);

// Search videos
router.get('/search/:query', searchVideos);

// Track views
router.post('/:videoId/views', trackViews);

module.exports = router;
