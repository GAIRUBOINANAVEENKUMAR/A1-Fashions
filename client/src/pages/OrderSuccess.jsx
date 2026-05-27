import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheckCircle, HiArrowRight } from 'react-icons/hi';

const OrderSuccess = () => (
    <div className="min-h-screen pt-14 flex items-center justify-center bg-white">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                <HiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-2xl font-bold text-dark mb-1">Order Placed!</h1>
            <p className="text-gray-500 mb-6">Thank you for shopping with ShopVerse</p>
            <div className="flex gap-3 justify-center">
                <Link to="/orders" className="btn-primary text-sm">View Orders</Link>
                <Link to="/shop" className="btn-outline flex items-center gap-2 text-sm">Continue Shopping <HiArrowRight /></Link>
            </div>
        </motion.div>
    </div>
);

export default OrderSuccess;
