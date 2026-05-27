const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter product name'],
            trim: true,
            maxLength: [200, 'Product name cannot exceed 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'Please enter product description'],
            maxLength: [4000, 'Description cannot exceed 4000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Please enter product price'],
            min: [0, 'Price cannot be negative'],
        },
        comparePrice: {
            type: Number,
            default: 0,
        },
        category: {
            type: String,
            required: [true, 'Please enter product category'],
            enum: [
                'Electronics',
                'Clothing',
                'Footwear',
                'Accessories',
                'Home & Kitchen',
                'Books',
                'Sports',
                'Beauty',
                'Toys',
                'Other',
            ],
        },
        brand: {
            type: String,
            default: 'Unbranded',
        },
        images: [
            {
                public_id: String,
                url: String,
            },
        ],
        stock: {
            type: Number,
            required: [true, 'Please enter product stock'],
            min: [0, 'Stock cannot be negative'],
            default: 1,
        },
        ratings: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        tags: {
            type: [String],
            default: [],
        },
        featured: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
