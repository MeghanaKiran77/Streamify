const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Video = require('../models/Video');

// Register a new user
exports.register = async (req, res) => {
    const { username, email, password, bio } = req.body;
    
    try {
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with bio
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            bio
        });

        // Save user to the database
        const savedUser = await newUser.save();

        // Generate token
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the token
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

// Login a user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with the token
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

// Fetch user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
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

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find videos by user
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

// Subscribe to a user
exports.subscribeUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const subscribeTo = await User.findById(req.body.subscribeTo);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!subscribeTo) {
            return res.status(404).json({ message: 'User to subscribe to not found' });
        }

        if (!user.subscriptions.includes(subscribeTo.id)) {
            user.subscriptions.push(subscribeTo.id);
            await user.save();
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

// Unsubscribe from a user
exports.unsubscribeUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const unsubscribeFrom = await User.findById(req.body.unsubscribeFrom);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!unsubscribeFrom) {
            return res.status(404).json({ message: 'User to unsubscribe from not found' });
        }

        user.subscriptions = user.subscriptions.filter(id => id.toString() !== unsubscribeFrom.id);
        await user.save();

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

