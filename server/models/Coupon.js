const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Please enter a coupon code'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        discount: {
            type: Number,
            required: [true, 'Please enter a discount value'],
            min: [1, 'Discount must be at least 1'],
        },
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            default: 'percentage',
        },
        minPurchase: {
            type: Number,
            default: 0,
        },
        maxDiscount: {
            type: Number,
            default: null,
        },
        expiresAt: {
            type: Date,
            required: [true, 'Please enter an expiration date'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        usageLimit: {
            type: Number,
            default: null,
        },
        usedCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
