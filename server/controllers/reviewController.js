const Review = require('../models/Review');

// @desc    Create / Update review
// @route   POST /api/v1/reviews
exports.createReview = async (req, res, next) => {
    try {
        const { productId, rating, title, comment } = req.body;

        const existingReview = await Review.findOne({
            user: req.user._id,
            product: productId,
        });

        if (existingReview) {
            existingReview.rating = rating;
            existingReview.title = title || existingReview.title;
            existingReview.comment = comment;
            await existingReview.save();
            return res.status(200).json({ success: true, review: existingReview });
        }

        const review = await Review.create({
            user: req.user._id,
            product: productId,
            rating,
            title: title || 'Review',
            comment,
        });

        res.status(201).json({ success: true, review });
    } catch (error) {
        next(error);
    }
};

// @desc    Get reviews for a product
// @route   GET /api/v1/reviews/:productId
exports.getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name avatar')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: reviews.length, reviews });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Review deleted' });
    } catch (error) {
        next(error);
    }
};
