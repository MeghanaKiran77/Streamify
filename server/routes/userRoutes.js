const express = require('express');
const router = express.Router();
const { getVideosByUser, getUserProfile, subscribeUser, unsubscribeUser, getCurrentUser } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// Route to get videos by user
router.get('/:userId/videos', auth, getVideosByUser);

// Route to get user profile
router.get('/:userId/profile', auth, getUserProfile);


// Route to subscribe to a user
router.post('/:userId/subscribe', auth, subscribeUser);

// Route to unsubscribe from a user
router.post('/:userId/unsubscribe', auth, unsubscribeUser);

router.get('/me', auth, getCurrentUser);

module.exports = router;