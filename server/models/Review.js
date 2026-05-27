const mongoose = require('mongoose');
const Product = require('./Product');

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please provide a rating'],
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            required: [true, 'Please provide a review title'],
            maxLength: [100, 'Title cannot exceed 100 characters'],
        },
        comment: {
            type: String,
            required: [true, 'Please provide a review comment'],
            maxLength: [1000, 'Review cannot exceed 1000 characters'],
        },
        images: [
            {
                public_id: String,
                url: String,
            },
        ],
    },
    { timestamps: true }
);

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method: recalculate avg rating
reviewSchema.statics.calcAverageRating = async function (productId) {
    const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: '$product',
                avgRating: { $avg: '$rating' },
                numReviews: { $sum: 1 },
            },
        },
    ]);

    if (result.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratings: Math.round(result[0].avgRating * 10) / 10,
            numReviews: result[0].numReviews,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratings: 0,
            numReviews: 0,
        });
    }
};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRating(this.product);
});

reviewSchema.post('findOneAndDelete', function (doc) {
    if (doc) doc.constructor.calcAverageRating(doc.product);
});

module.exports = mongoose.model('Review', reviewSchema);
