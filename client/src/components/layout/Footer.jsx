import { Link } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import { FaGithub, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-black text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-bold text-sm">A1</div>
                            <span className="text-lg font-bold text-white">A1-Fashions</span>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Discover premium products across electronics, fashion, beauty, and more. Fast shipping & secure payments.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
                        <ul className="space-y-2">
                            {['Home', 'Shop', 'Cart'].map((item) => (
                                <li key={item}>
                                    <Link to={`/${item === 'Home' ? '' : item.toLowerCase()}`} className="text-white/50 hover:text-white text-sm transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-3">Categories</h4>
                        <ul className="space-y-2">
                            {['Electronics', 'Clothing', 'Footwear', 'Accessories', 'Beauty'].map((cat) => (
                                <li key={cat}>
                                    <Link to={`/shop?category=${cat}`} className="text-white/50 hover:text-white text-sm transition-colors">
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-3">Stay Updated</h4>
                        <p className="text-white/50 text-sm mb-3">Get exclusive deals and updates.</p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                            <div className="relative flex-1">
                                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                                <input type="email" placeholder="Your email" className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all" />
                            </div>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors">
                                Join
                            </button>
                        </form>
                        <div className="flex gap-2 mt-4">
                            {[FaGithub, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                                    <Icon className="w-3.5 h-3.5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-6 pt-4 text-center text-white/30 text-xs">
                    © {new Date().getFullYear()} A1-Store. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
