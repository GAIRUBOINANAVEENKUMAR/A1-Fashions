const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createReview,
    getProductReviews,
    deleteReview,
} = require('../controllers/reviewController');

router.post('/', protect, createReview);
router.get('/:productId', getProductReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
