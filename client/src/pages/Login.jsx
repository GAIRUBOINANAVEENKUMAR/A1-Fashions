import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { loginUser, clearError } from '../features/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
    }, [error, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-14 px-4 bg-gray-50">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary-400 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">S</div>
                        <h1 className="text-2xl font-bold text-dark">Welcome Back</h1>
                        <p className="text-gray-500 text-sm mt-1">Sign in to your A1-Store account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input-field pl-11" required />
                        </div>
                        <div className="relative">
                            <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input-field pl-11 pr-11" required />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors">
                                {showPass ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                            </button>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Signing in...' : 'Sign In'}</button>
                    </form>

                    <div className="mt-5 bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1.5 font-medium">Demo Accounts:</p>
                        <div className="space-y-0.5 text-xs text-gray-500">
                            <p>Admin: admin@a1-store.com / admin123</p>
                            <p>User: user@a1-store.com / user123</p>
                        </div>
                    </div>

                    <p className="text-center text-gray-500 text-sm mt-5">
                        Don't have an account? <Link to="/register" className="text-primary-500 hover:text-primary-400 font-medium">Sign Up</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
