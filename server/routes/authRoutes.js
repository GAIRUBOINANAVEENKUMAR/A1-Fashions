const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/upload');
const { registerValidator, loginValidator } = require('../utils/validators');
const {
    register,
    login,
    logout,
    getMe,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    updateAddresses,
    updateAvatar,
    toggleWishlist,
    getWishlist,
} = require('../controllers/authController');

router.post('/register', authLimiter, registerValidator, register);
router.post('/login', authLimiter, loginValidator, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/addresses', protect, updateAddresses);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);
router.get('/wishlist', protect, getWishlist);
router.put('/wishlist', protect, toggleWishlist);

module.exports = router;

