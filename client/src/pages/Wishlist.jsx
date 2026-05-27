import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiHeart, HiShoppingCart, HiTrash } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { fetchWishlist, removeFromWishlist } from '../features/wishlistSlice';
import { addToCart } from '../features/cartSlice';
import { selectConvertedPrice } from '../features/currencySlice';
import toast from 'react-hot-toast';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((s) => s.wishlist);
    const state = useSelector((s) => s);

    useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

    const handleRemove = async (productId) => { dispatch(removeFromWishlist(productId)); toast.success('Removed from wishlist'); };
    const handleAddToCart = (product) => { dispatch(addToCart({ product, quantity: 1 })); toast.success('Added to cart'); };

    return (
        <div className="min-h-screen bg-gray-50 pt-14">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
                    <HiHeart className="text-red-500" /> My Wishlist
                </h1>

                {loading ? (
                    <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" /></div>
                ) : items.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
                        <HiHeart className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg text-dark mb-1">Your wishlist is empty</h3>
                        <p className="text-gray-500 text-sm mb-4">Add products you love to your wishlist</p>
                        <Link to="/shop" className="btn-primary text-sm">Browse Products</Link>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {items.map((product, i) => {
                            const displayPrice = selectConvertedPrice(state, product.price);
                            const displayComparePrice = product.comparePrice > product.price ? selectConvertedPrice(state, product.comparePrice) : null;
                            return (
                                <motion.div key={product._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                    className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
                                    <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                                        <img src={product.images?.[0]?.url || 'https://placehold.co/400x400/f5f5f5/999?text=Product'} alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        {product.comparePrice > product.price && (
                                            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                                                {Math.round((1 - product.price / product.comparePrice) * 100)}% OFF
                                            </span>
                                        )}
                                    </Link>
                                    <div className="p-3.5">
                                        <Link to={`/product/${product._id}`} className="text-dark font-medium text-sm hover:text-primary-500 transition line-clamp-2">{product.name}</Link>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-base font-bold text-dark">{displayPrice}</span>
                                            {displayComparePrice && (
                                                <span className="text-gray-400 text-sm line-through">{displayComparePrice}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <button onClick={() => handleAddToCart(product)} className="btn-primary flex-1 flex items-center justify-center gap-1 text-xs py-2">
                                                <HiShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                                            </button>
                                            <button onClick={() => handleRemove(product._id)} className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 text-red-500 transition">
                                                <HiTrash className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
