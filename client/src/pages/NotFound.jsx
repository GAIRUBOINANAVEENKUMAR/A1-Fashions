import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <h1 className="text-8xl font-black text-primary-400 mb-3">404</h1>
            <p className="text-lg text-gray-500 mb-5">Page not found</p>
            <Link to="/" className="btn-primary text-sm">Go Home</Link>
        </motion.div>
    </div>
);

export default NotFound;
