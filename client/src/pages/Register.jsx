import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineUser } from 'react-icons/hi';
import { registerUser, clearError } from '../features/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);
    useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
        dispatch(registerUser({ name: formData.name, email: formData.email, password: formData.password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-14 px-4 bg-gray-50">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-primary-400 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">S</div>
                        <h1 className="text-2xl font-bold text-dark">Create Account</h1>
                        <p className="text-gray-500 text-sm mt-1">Join ShopVerse today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Full Name" className="input-field pl-11" required />
                        </div>
                        <div className="relative">
                            <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email address" className="input-field pl-11" required />
                        </div>
                        <div className="relative">
                            <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input name="password" type={showPass ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Password" className="input-field pl-11 pr-11" required minLength={6} />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark">
                                {showPass ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="relative">
                            <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="input-field pl-11" required />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating Account...' : 'Create Account'}</button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-5">
                        Already have an account? <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
