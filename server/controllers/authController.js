const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const sendToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/v1/auth/register
exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password });
        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
exports.login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
exports.logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
};

// @desc    Update profile
// @route   PUT /api/v1/auth/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, email },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/v1/auth/password
exports.changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('+password');
        const isMatch = await user.comparePassword(req.body.currentPassword);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = req.body.newPassword;
        await user.save();
        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'No user found with that email' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        const html = `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="padding:10px 20px;background:#6C63FF;color:white;border-radius:8px;text-decoration:none;">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
    `;

        try {
            await sendEmail({ to: user.email, subject: 'ShopVerse Password Reset', html });
            res.status(200).json({ success: true, message: 'Email sent' });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:token
exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Update addresses
// @route   PUT /api/v1/auth/addresses
exports.updateAddresses = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { addresses: req.body.addresses },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update avatar
// @route   PUT /api/v1/auth/avatar
exports.updateAvatar = async (req, res, next) => {
    try {
        const cloudinary = require('../config/cloudinary');

        let imageUrl;

        if (req.file) {
            // Upload from multer file buffer
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = `data:${req.file.mimetype};base64,${b64}`;
            const result = await cloudinary.uploader.upload(dataURI, {
                folder: 'shopverse/avatars',
                width: 250,
                crop: 'scale',
            });
            imageUrl = { public_id: result.public_id, url: result.secure_url };
        } else if (req.body.avatar) {
            // Upload from base64 string
            const result = await cloudinary.uploader.upload(req.body.avatar, {
                folder: 'shopverse/avatars',
                width: 250,
                crop: 'scale',
            });
            imageUrl = { public_id: result.public_id, url: result.secure_url };
        } else {
            return res.status(400).json({ success: false, message: 'Please provide an image' });
        }

        // Delete old avatar from Cloudinary if exists
        const currentUser = await User.findById(req.user._id);
        if (currentUser.avatar?.public_id && currentUser.avatar.public_id !== 'default') {
            try {
                await cloudinary.uploader.destroy(currentUser.avatar.public_id);
            } catch (e) { /* ignore */ }
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: imageUrl },
            { new: true }
        );

        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle product in wishlist
// @route   PUT /api/v1/auth/wishlist
exports.toggleWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.user._id);

        const index = user.wishlist.indexOf(productId);
        if (index === -1) {
            user.wishlist.push(productId);
        } else {
            user.wishlist.splice(index, 1);
        }

        await user.save();

        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.status(200).json({ success: true, wishlist: updatedUser.wishlist });
    } catch (error) {
        next(error);
    }
};

// @desc    Get wishlist
// @route   GET /api/v1/auth/wishlist
exports.getWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.status(200).json({ success: true, wishlist: user.wishlist || [] });
    } catch (error) {
        next(error);
    }
};
