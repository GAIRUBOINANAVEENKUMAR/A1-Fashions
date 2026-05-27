const stripe = require('../config/stripe');
const Coupon = require('../models/Coupon');

// @desc    Create Stripe checkout session
// @route   POST /api/v1/payment/checkout-session
exports.createCheckoutSession = async (req, res, next) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;

        const lineItems = orderItems.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            customer_email: req.user.email,
            metadata: {
                userId: req.user._id.toString(),
                shippingAddress: JSON.stringify(shippingAddress),
            },
        });

        res.status(200).json({ success: true, sessionId: session.id, url: session.url });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify payment
// @route   GET /api/v1/payment/verify/:sessionId
exports.verifyPayment = async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

        res.status(200).json({
            success: true,
            payment: {
                id: session.payment_intent,
                status: session.payment_status,
                amount: session.amount_total / 100,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Apply coupon
// @route   POST /api/v1/payment/apply-coupon
exports.applyCoupon = async (req, res, next) => {
    try {
        const { code, cartTotal } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
            expiresAt: { $gt: Date.now() },
        });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
        }

        if (cartTotal < coupon.minPurchase) {
            return res.status(400).json({
                success: false,
                message: `Minimum purchase of $${coupon.minPurchase} required`,
            });
        }

        let discount;
        if (coupon.discountType === 'fixed') {
            discount = coupon.discount;
        } else {
            // percentage
            discount = (cartTotal * coupon.discount) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        }

        res.status(200).json({
            success: true,
            discount: Math.round(discount * 100) / 100,
            coupon: { code: coupon.code, discount: coupon.discount, discountType: coupon.discountType },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Stripe webhook handler
// @route   POST /api/v1/payment/webhook
exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        try {
            const Order = require('../models/Order');
            const Cart = require('../models/Cart');

            // Create order from webhook data
            const metadata = session.metadata;
            const shippingAddress = JSON.parse(metadata.shippingAddress || '{}');

            const cart = await Cart.findOne({ user: metadata.userId }).populate('items.product');
            if (cart && cart.items.length > 0) {
                const orderItems = cart.items.map((item) => ({
                    product: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.images?.[0]?.url || '',
                }));

                const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const taxPrice = Math.round(itemsPrice * 0.08 * 100) / 100;
                const shippingPrice = itemsPrice > 50 ? 0 : 9.99;

                await Order.create({
                    user: metadata.userId,
                    orderItems,
                    shippingAddress,
                    paymentInfo: {
                        id: session.payment_intent,
                        status: 'paid',
                        method: 'stripe',
                    },
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice: session.amount_total / 100,
                    orderStatus: 'Confirmed',
                });

                // Clear cart after successful order
                await Cart.findOneAndDelete({ user: metadata.userId });
            }
        } catch (orderError) {
            console.error('Error creating order from webhook:', orderError);
        }
    }

    res.status(200).json({ received: true });
};

