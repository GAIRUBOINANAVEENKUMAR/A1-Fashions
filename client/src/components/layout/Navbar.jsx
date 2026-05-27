import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineMenu, HiOutlineX, HiOutlineSearch, HiOutlineHeart } from 'react-icons/hi';
import { logoutUser } from '../../features/authSlice';
import { setCurrency } from '../../features/currencySlice';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);
    const { current, currencies } = useSelector((state) => state.currency);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currencyRef = useRef(null);
    const userMenuRef = useRef(null);

    const cartCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

    useEffect(() => {
        const handleClick = (e) => {
            if (currencyRef.current && !currencyRef.current.contains(e.target)) setCurrencyOpen(false);
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenu(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?keyword=${searchQuery}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        setUserMenu(false);
        navigate('/');
    };

    const currencyInfo = currencies[current];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            {/* Main navbar row */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16 gap-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-9 h-9 rounded-lg bg-dark flex items-center justify-center text-white font-bold text-base">A1</div>
                        <span className="text-xl font-bold text-dark tracking-tight hidden sm:block">A1-Fashions</span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-1">
                        <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-dark hover:bg-gray-50 transition-colors">Home</Link>
                        <Link to="/shop" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-dark hover:bg-gray-50 transition-colors">Shop</Link>
                        {isAuthenticated && (
                            <Link to="/wishlist" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-dark hover:bg-gray-50 transition-colors flex items-center gap-1">
                                <HiOutlineHeart className="w-4 h-4" /> Wishlist
                            </Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-dark hover:bg-gray-50 transition-colors">
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Search Bar – inline, Amazon-style */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-300 bg-gray-50 text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                            />
                            <button type="submit" className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-500 hover:text-dark transition-colors">
                                <HiOutlineSearch className="w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    {/* Right actions */}
                    <div className="flex items-center gap-1 ml-auto lg:ml-0">
                        {/* Currency */}
                        <div className="relative hidden sm:block" ref={currencyRef}>
                            <button
                                onClick={() => setCurrencyOpen(!currencyOpen)}
                                className="flex items-center gap-1 h-10 px-3 rounded-lg text-sm text-gray-600 hover:text-dark hover:bg-gray-50 transition-colors"
                            >
                                <span>{currencyInfo.symbol}</span>
                                <span className="text-xs">{current}</span>
                                <svg className={`w-3 h-3 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <AnimatePresence>
                                {currencyOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50"
                                    >
                                        <div className="px-4 py-2.5 border-b border-gray-100">
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Currency</p>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto p-1">
                                            {Object.entries(currencies).map(([code, info]) => (
                                                <button
                                                    key={code}
                                                    onClick={() => { dispatch(setCurrency(code)); setCurrencyOpen(false); }}
                                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${current === code ? 'bg-gray-100 text-dark font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    <span className="w-6 text-center">{info.symbol}</span>
                                                    <span className="flex-1 text-left text-xs">{info.name}</span>
                                                    <span className="text-xs text-gray-400">{code}</span>
                                                    {current === code && <span className="text-dark">✓</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile search toggle */}
                        <button onClick={() => navigate('/shop')} className="md:hidden p-2.5 rounded-lg text-gray-600 hover:text-dark hover:bg-gray-50 transition-colors">
                            <HiOutlineSearch className="w-5 h-5" />
                        </button>

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2.5 rounded-lg text-gray-600 hover:text-dark hover:bg-gray-50 transition-colors">
                            <HiOutlineShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white px-1">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User / Login */}
                        {isAuthenticated ? (
                            <div className="relative" ref={userMenuRef}>
                                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-xs font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                                </button>
                                <AnimatePresence>
                                    {userMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                                <p className="text-sm font-semibold text-dark">{user?.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                            <div className="p-1.5">
                                                <Link to="/profile" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <HiOutlineUser className="w-4 h-4 text-gray-400" /> Profile
                                                </Link>
                                                <Link to="/orders" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <HiOutlineShoppingBag className="w-4 h-4 text-gray-400" /> My Orders
                                                </Link>
                                                <Link to="/wishlist" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                    <HiOutlineHeart className="w-4 h-4 text-gray-400" /> Wishlist
                                                </Link>
                                                {user?.role === 'admin' && (
                                                    <Link to="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                                                        ⚙️ Admin Dashboard
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="border-t border-gray-100 p-1.5">
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors">
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 h-9 px-4 rounded-lg bg-dark hover:bg-gray-800 text-white transition-colors text-sm font-medium">
                                Sign In
                            </Link>
                        )}

                        {/* Mobile hamburger */}
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2.5 rounded-lg text-gray-600 hover:text-dark hover:bg-gray-50 transition-colors">
                            {mobileOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="lg:hidden overflow-hidden border-t border-gray-100 bg-white"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
                            {/* Mobile search */}
                            <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="mb-2">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                                    />
                                    <button type="submit" className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-gray-400">
                                        <HiOutlineSearch className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Home</Link>
                            <Link to="/shop" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Shop</Link>
                            {isAuthenticated && (
                                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Wishlist</Link>
                            )}
                            {user?.role === 'admin' && (
                                <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Admin Dashboard</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
