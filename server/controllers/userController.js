const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all users (admin)
// @route   GET /api/v1/users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort('-createdAt');
        res.status(200).json({ success: true, count: users.length, users });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user (admin)
// @route   GET /api/v1/users/:id
exports.getSingleUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role (admin)
// @route   PUT /api/v1/users/:id/role
exports.updateUserRole = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: req.body.role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user (admin)
// @route   DELETE /api/v1/users/:id
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        await user.deleteOne();
        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Admin dashboard stats
// @route   GET /api/v1/users/admin/stats
exports.getAdminStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

        // Monthly revenue (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    orderStatus: { $ne: 'Cancelled' },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    revenue: { $sum: '$totalPrice' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                monthlyRevenue,
            },
        });
    } catch (error) {
        next(error);
    }
};
