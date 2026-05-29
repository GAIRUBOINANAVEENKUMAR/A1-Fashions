import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiArrowRight, HiShieldCheck, HiLightningBolt, HiTruck, HiStar } from 'react-icons/hi';
import { fetchFeaturedProducts, fetchCategories } from '../features/productSlice';
import ProductCard from '../components/common/ProductCard';
import { ProductSkeleton } from '../components/common/Loader';

const categories = [
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop' },
    { name: 'Clothing', img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop' },
    { name: 'Footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
    { name: 'Accessories', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' },
    { name: 'Beauty', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop' },
    { name: 'Home & Kitchen', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop' },
    { name: 'Sports', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop' },
    { name: 'Books', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop' },
    { name: 'Toys', img: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop' },
    { name: 'Other', img: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop' },
];

const features = [
    { icon: HiLightningBolt, title: 'Fast Shipping', desc: 'Free delivery on orders over $50' },
    { icon: HiShieldCheck, title: 'Secure Payments', desc: 'SSL encrypted checkout' },
    { icon: HiTruck, title: 'Easy Returns', desc: '30-day hassle-free returns' },
    { icon: HiStar, title: 'Premium Quality', desc: 'Curated top-tier products' },
];

/* Scrolling brand/product images for marquee */
const marqueeImages = [
    { src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', alt: 'Watch' },
    { src: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', alt: 'Headphones' },
    { src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', alt: 'Nike Shoe' },
    { src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop', alt: 'Camera' },
    { src: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', alt: 'Perfume' },
    { src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop', alt: 'Sneaker' },
    { src: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', alt: 'Sunglasses' },
    { src: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop', alt: 'Handbag' },
    { src: 'https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=400&h=400&fit=crop', alt: 'Skincare' },
    { src: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop', alt: 'Jewelry' },
];

const Home = () => {
    const dispatch = useDispatch();
    const { featuredProducts, loading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchFeaturedProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero – blurred video background */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                <video
                    autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
                    poster="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1920"
                >
                    <source src="https://videos.pexels.com/video-files/3015510/3015510-hd_1920_1080_24fps.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5"
                        style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #D946EF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                    >
                        Discover Premium Products
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto"
                    >
                        Explore our curated collection of the finest electronics, fashion, beauty, and lifestyle products at unbeatable prices.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap gap-3 justify-center mb-12"
                    >
                        <Link to="/shop" className="bg-black text-white hover:bg-gray-900 font-semibold rounded-lg flex items-center gap-2 text-base py-3.5 px-8 transition-colors">
                            Shop Now <HiArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/shop?featured=true" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-lg flex items-center gap-2 text-base py-3.5 px-8 transition-all">
                            Featured Items
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.45 }}
                        className="flex justify-center gap-10 md:gap-16"
                    >
                        {[
                            { num: '10K+', label: 'Products' },
                            { num: '50K+', label: 'Customers' },
                            { num: '4.9', label: 'Rating' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-2xl md:text-3xl font-bold text-white">{stat.num}</p>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Scrolling Product Image Marquee */}
            <section className="py-10 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <p className="text-center text-gray-400 text-sm font-medium uppercase tracking-widest">Trending Products</p>
                </div>
                <div className="relative">
                    {/* Fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10" />
                    {/* Scrolling track */}
                    <div className="animate-marquee flex gap-6 w-max">
                        {[...marqueeImages, ...marqueeImages].map((img, i) => (
                            <div key={i} className="w-48 h-48 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 shrink-0 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-dark mb-3">Shop by Category</h2>
                        <p className="text-gray-500 max-w-md mx-auto">Browse our wide range of categories and find exactly what you need</p>
                    </motion.div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                            >
                                <Link
                                    to={`/shop?category=${cat.name}`}
                                    className="group relative block rounded-2xl overflow-hidden aspect-square"
                                >
                                    <img
                                        src={cat.img} alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-white font-semibold text-sm md:text-base">{cat.name}</h3>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-2">Featured Products</h2>
                            <p className="text-gray-500">Handpicked premium items just for you</p>
                        </div>
                        <Link to="/shop" className="hidden md:flex items-center gap-2 text-sm font-semibold text-dark hover:text-gray-600 border border-gray-300 rounded-lg py-2.5 px-5 hover:bg-gray-50 transition-colors">
                            View All <HiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {loading
                            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
                            : featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        }
                    </div>
                    <div className="mt-10 text-center md:hidden">
                        <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-dark border border-gray-300 rounded-lg py-2.5 px-5 hover:bg-gray-50 transition-colors">
                            View All Products <HiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us – Feature Boxes */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-dark mb-3">Why Choose A1-Fashions</h2>
                        <p className="text-gray-500 max-w-md mx-auto">We're committed to providing the best shopping experience</p>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <f.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-dark font-bold text-base mb-1.5">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="relative rounded-2xl overflow-hidden"
                    >
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1400&h=600&fit=crop"
                                alt="" className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-dark/85" />
                        </div>
                        <div className="relative z-10 py-16 md:py-20 px-8 md:px-16 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Get 20% Off Your First Order</h2>
                            <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
                                Use code <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">WELCOME20</span> at checkout for an exclusive discount.
                            </p>
                            <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-dark font-semibold rounded-lg py-3.5 px-8 hover:bg-gray-100 transition-colors text-base">
                                Start Shopping <HiArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
