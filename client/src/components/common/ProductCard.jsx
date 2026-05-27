import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineShoppingCart, HiStar, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { addToCart, addToLocalCart } from '../../features/cartSlice';
import { toggleWishlistItem } from '../../features/wishlistSlice';
import { selectConvertedPrice } from '../../features/currencySlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const state = useSelector((s) => s);
    const displayPrice = selectConvertedPrice(state, product.price);
    const displayComparePrice = product.comparePrice ? selectConvertedPrice(state, product.comparePrice) : null;

    const isInWishlist = wishlistItems.some((item) => item._id === product._id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAuthenticated) {
            dispatch(addToCart({ productId: product._id }));
        } else {
            dispatch(addToLocalCart(product));
        }
        toast.success('Added to cart!');
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) return toast.error('Please login to use wishlist');
        dispatch(toggleWishlistItem(product._id));
        toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const discount = product.comparePrice
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Link to={`/product/${product._id}`} className="group block">
                <div className="card overflow-hidden p-0">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-square bg-white border-b border-gray-100">
                        <img
                            src={product.images?.[0]?.url || 'https://placehold.co/400x400/F5F5F5/999?text=Product'}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        {discount > 0 && (
                            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                                -{discount}%
                            </span>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                            <span className="absolute top-2.5 right-2.5 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                                Only {product.stock} left
                            </span>
                        )}
                        {/* Wishlist heart */}
                        <button
                            onClick={handleToggleWishlist}
                            className={`absolute top-2.5 ${product.stock <= 5 && product.stock > 0 ? 'right-24' : 'right-2.5'} w-8 h-8 rounded-full flex items-center justify-center transition-all ${isInWishlist ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100'}`}
                        >
                            {isInWishlist ? <HiHeart className="w-4.5 h-4.5" /> : <HiOutlineHeart className="w-4.5 h-4.5" />}
                        </button>
                        {/* Quick add */}
                        <button
                            onClick={handleAddToCart}
                            className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-lg bg-primary-400 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-500"
                        >
                            <HiOutlineShoppingCart className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="p-3.5">
                        <p className="text-xs text-gray-500 font-medium mb-1">{product.category}</p>
                        <h3 className="text-dark font-medium text-sm line-clamp-2 mb-1.5 group-hover:text-primary-500 transition-colors">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-0.5 mb-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <HiStar
                                    key={star}
                                    className={`w-3.5 h-3.5 ${star <= Math.round(product.ratings || 0) ? 'text-yellow-400' : 'text-gray-200'}`}
                                />
                            ))}
                            <span className="text-xs text-gray-400 ml-1">({product.numReviews || 0})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-dark">{displayPrice}</span>
                            {displayComparePrice && (
                                <span className="text-sm text-gray-400 line-through">{displayComparePrice}</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
