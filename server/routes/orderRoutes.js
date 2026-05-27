const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
} = require('../controllers/orderController');

router.use(protect); // All order routes require auth

router.post('/', createOrder);
router.get('/me', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin
router.get('/admin/all', adminOnly, getAllOrders);
router.put('/admin/:id', adminOnly, updateOrderStatus);
router.delete('/admin/:id', adminOnly, deleteOrder);

module.exports = router;
