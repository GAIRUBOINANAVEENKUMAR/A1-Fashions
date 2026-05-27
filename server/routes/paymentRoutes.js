const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createCheckoutSession,
    verifyPayment,
    applyCoupon,
    stripeWebhook,
} = require('../controllers/paymentController');

// Webhook must come BEFORE protect middleware and use raw body
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

router.use(protect);

router.post('/checkout-session', createCheckoutSession);
router.get('/verify/:sessionId', verifyPayment);
router.post('/apply-coupon', applyCoupon);

module.exports = router;

