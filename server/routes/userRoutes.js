const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser,
    getAdminStats,
} = require('../controllers/userController');

router.use(protect, adminOnly); // All user management routes are admin only

router.get('/', getAllUsers);
router.get('/admin/stats', getAdminStats);
router.get('/:id', getSingleUser);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
