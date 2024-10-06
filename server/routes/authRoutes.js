const express = require('express');
const router = express.Router();
const { registerUser, loginUser, generateResetToken, resetPassword } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Password reset routes
router.post('/password-reset', generateResetToken);
router.post('/reset-password', resetPassword);

module.exports = router;
