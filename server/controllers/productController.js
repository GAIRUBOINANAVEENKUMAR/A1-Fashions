const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const ApiFeatures = require('../utils/apiFeatures');

// @desc    Get all products (with search, filter, sort, paginate)
// @route   GET /api/v1/products
exports.getAllProducts = async (req, res, next) => {
    try {
        const totalProducts = await Product.countDocuments();
        const apiFeatures = new ApiFeatures(Product.find(), req.query)
            .search()
            .filter()
            .sort()
            .paginate();

        const products = await apiFeatures.query;

        // Count for filtered results
        const filteredFeatures = new ApiFeatures(Product.find(), req.query)
            .search()
            .filter();
        const filteredCount = await Product.countDocuments(
            filteredFeatures.query.getFilter()
        );

        const limit = parseInt(req.query.limit, 10) || 12;
        const totalPages = Math.ceil(filteredCount / limit);

        res.status(200).json({
            success: true,
            totalProducts,
            filteredCount,
            totalPages,
            currentPage: parseInt(req.query.page, 10) || 1,
            products,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured products
// @route   GET /api/v1/products/featured
exports.getFeaturedProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ featured: true }).limit(8);
        res.status(200).json({ success: true, products });
    } catch (error) {
        next(error);
    }
};

// @desc    Get products by category
// @route   GET /api/v1/products/category/:category
exports.getByCategory = async (req, res, next) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate({
            path: 'reviews',
            populate: { path: 'user', select: 'name avatar' },
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product (admin)
// @route   POST /api/v1/products
exports.createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        req.body.createdBy = req.user._id;

        // Default placeholder images if none provided
        if (!req.body.images || req.body.images.length === 0) {
            req.body.images = [
                {
                    public_id: 'default',
                    url: `https://placehold.co/600x600/6C63FF/ffffff?text=${encodeURIComponent(req.body.name.substring(0, 15))}`,
                },
            ];
        }

        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product (admin)
// @route   PUT /api/v1/products/:id
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product (admin)
// @route   DELETE /api/v1/products/:id
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        await product.deleteOne();
        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all categories
// @route   GET /api/v1/products/categories/all
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Product.distinct('category');
        res.status(200).json({ success: true, categories });
    } catch (error) {
        next(error);
    }
};

// @desc    Upload product images (admin)
// @route   POST /api/v1/products/:id/images
exports.uploadProductImages = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const cloudinary = require('../config/cloudinary');
        const uploadedImages = [];

        if (req.files && req.files.length > 0) {
            // Upload from multer files
            for (const file of req.files) {
                const b64 = Buffer.from(file.buffer).toString('base64');
                const dataURI = `data:${file.mimetype};base64,${b64}`;
                const result = await cloudinary.uploader.upload(dataURI, {
                    folder: 'shopverse/products',
                    width: 800,
                    crop: 'scale',
                });
                uploadedImages.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
        } else if (req.body.images && Array.isArray(req.body.images)) {
            // Accept direct URL arrays (for seed/test data)
            for (const img of req.body.images) {
                uploadedImages.push({
                    public_id: img.public_id || `manual_${Date.now()}`,
                    url: img.url,
                });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Please provide images' });
        }

        // Delete old images from Cloudinary
        for (const img of product.images) {
            if (img.public_id && !img.public_id.startsWith('manual_') && !img.public_id.includes('_1')) {
                try {
                    await cloudinary.uploader.destroy(img.public_id);
                } catch (e) { /* ignore */ }
            }
        }

        product.images = uploadedImages;
        await product.save();

        res.status(200).json({ success: true, product });
    } catch (error) {
        next(error);
    }
};
