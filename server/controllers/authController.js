const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Register a new user
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            console.log('User already exists');
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        console.log('User saved:', user);

        // Generate a JWT token with expiry
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            '3&$364&vvu5$ytv', // Replace with process.env.JWT_SECRET in production
            { expiresIn: 3600 }, // Token expires in 1 hour (adjust as needed)
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    id: user.id,
                    token: token,
                    expiresIn: 3600, // Expiry time in seconds (optional: send to client)
                });
            }
        );
    } catch (err) {
        console.error('Server error:', err.message);
        res.status(500).send('Server error');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Generate a JWT token with expiry
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            '3&$364&vvu5$ytv', // Replace with process.env.JWT_SECRET in production
            { expiresIn: 3600 }, // Token expires in 1 hour (adjust as needed)
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    id: user.id,
                    token: token,
                    expiresIn: 3600 // Expiry time in seconds (optional: send to client)
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Generate JWT token for password reset
exports.generateResetToken = async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Generate a reset token
        const resetToken = jwt.sign({ id: user.id }, '3&$364&vvu5$ytv', { expiresIn: '1h' }); // Replace with process.env.JWT_SECRET in production

        // Send reset token via email
        // Configure nodemailer
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'youremail@gmail.com', // replace with your email
                pass: 'yourpassword', // replace with your email password
            },
        });

        let mailOptions = {
            from: 'youremail@gmail.com', // replace with your email
            to: user.email,
            subject: 'Password Reset',
            text: `You requested a password reset. Use the following token to reset your password: ${resetToken}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error.message);
                return res.status(500).json({ msg: 'Error sending email' });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ msg: 'Password reset token sent to email' });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify token
        const decoded = jwt.verify(token, '3&$364&vvu5$ytv'); // Replace with process.env.JWT_SECRET in production
        let user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.status(200).json({ msg: 'Password reset successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
