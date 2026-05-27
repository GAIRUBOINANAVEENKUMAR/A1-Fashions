const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');
const { productValidator } = require('../utils/validators');
const {
    getAllProducts,
    getFeaturedProducts,
    getByCategory,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    uploadProductImages,
} = require('../controllers/productController');

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories/all', getCategories);
router.get('/category/:category', getByCategory);
router.get('/:id', getSingleProduct);

// Admin
router.post('/', protect, adminOnly, productValidator, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/images', protect, adminOnly, upload.array('images', 5), uploadProductImages);

module.exports = router;

