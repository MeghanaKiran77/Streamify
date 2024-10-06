const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '3&$364&vvu5$ytv'); // Use environment variable in production

        // Set user from token payload
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message); // Log error for debugging
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
