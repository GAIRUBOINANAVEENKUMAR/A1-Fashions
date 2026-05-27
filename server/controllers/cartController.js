const Cart = require('../models/Cart');

// @desc    Get user's cart
// @route   GET /api/v1/cart
exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate(
            'items.product',
            'name price images stock'
        );

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Add item to cart
// @route   POST /api/v1/cart/add
exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity }],
            });
        } else {
            const existingItem = cart.items.find(
                (item) => item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
            await cart.save();
        }

        cart = await cart.populate('items.product', 'name price images stock');
        res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/update
exports.updateCartItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const item = cart.items.find(
            (i) => i.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not in cart' });
        }

        item.quantity = quantity;
        await cart.save();

        await cart.populate('items.product', 'name price images stock');
        res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/remove/:productId
exports.removeCartItem = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== req.params.productId
        );
        await cart.save();

        await cart.populate('items.product', 'name price images stock');
        res.status(200).json({ success: true, cart });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear cart
// @route   DELETE /api/v1/cart/clear
exports.clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.status(200).json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        next(error);
    }
};
