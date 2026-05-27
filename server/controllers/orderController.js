const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create order
// @route   POST /api/v1/orders
exports.createOrder = async (req, res, next) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        // Reduce stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        // Clear user's cart
        await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

        res.status(201).json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged-in user's orders
// @route   GET /api/v1/orders/me
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
        res.status(200).json({ success: true, count: orders.length, orders });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Allow user or admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (order.orderStatus !== 'Processing') {
            return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
        }

        order.orderStatus = 'Cancelled';
        order.cancelledAt = Date.now();
        await order.save();

        // Restore stock
        for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/v1/orders/admin/all
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort('-createdAt');

        const totalAmount = orders.reduce((sum, o) => sum + o.totalPrice, 0);

        res.status(200).json({
            success: true,
            count: orders.length,
            totalAmount,
            orders,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (admin)
// @route   PUT /api/v1/orders/admin/:id
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.orderStatus === 'Delivered') {
            return res.status(400).json({ success: false, message: 'Order already delivered' });
        }

        order.orderStatus = req.body.status;
        if (req.body.status === 'Delivered') {
            order.deliveredAt = Date.now();
        }
        await order.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete order (admin)
// @route   DELETE /api/v1/orders/admin/:id
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        await order.deleteOne();
        res.status(200).json({ success: true, message: 'Order deleted' });
    } catch (error) {
        next(error);
    }
};
