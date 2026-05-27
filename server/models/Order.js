const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                image: String,
            },
        ],
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentInfo: {
            id: String,
            status: String,
            method: { type: String, default: 'stripe' },
        },
        itemsPrice: { type: Number, required: true, default: 0 },
        taxPrice: { type: Number, required: true, default: 0 },
        shippingPrice: { type: Number, required: true, default: 0 },
        totalPrice: { type: Number, required: true, default: 0 },
        couponApplied: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coupon',
        },
        orderStatus: {
            type: String,
            enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Processing',
        },
        deliveredAt: Date,
        cancelledAt: Date,
        trackingNumber: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
