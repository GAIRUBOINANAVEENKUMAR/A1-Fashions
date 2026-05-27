import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiStar, HiShoppingCart, HiMinus, HiPlus, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import { fetchSingleProduct } from '../features/productSlice';
import { addToCart, addToLocalCart } from '../features/cartSlice';
import { toggleWishlistItem, fetchWishlist } from '../features/wishlistSlice';
import { selectConvertedPrice } from '../features/currencySlice';
import { Loader } from '../components/common/Loader';
import toast from 'react-hot-toast';
import API from '../api/axios';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { product, loading } = useSelector((state) => state.products);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const wishlistItems = useSelector((state) => state.wishlist.items);
    const state = useSelector((s) => s);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
    const [reviews, setReviews] = useState([]);

    useEffect(() => { dispatch(fetchSingleProduct(id)); }, [dispatch, id]);
    useEffect(() => { if (product) setReviews(product.reviews || []); }, [product]);
    useEffect(() => { if (isAuthenticated) dispatch(fetchWishlist()); }, [dispatch, isAuthenticated]);

    const isInWishlist = wishlistItems.some((item) => item._id === id);

    const handleAddToCart = () => {
        if (isAuthenticated) dispatch(addToCart({ productId: product._id, quantity }));
        else dispatch(addToLocalCart({ ...product, quantity }));
        toast.success(`Added ${quantity} item(s) to cart!`);
    };

    const handleToggleWishlist = () => {
        if (!isAuthenticated) return toast.error('Please login to use wishlist');
        dispatch(toggleWishlistItem(id));
        toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return toast.error('Please login to write a review');
        try {
            await API.post('/reviews', { productId: id, ...reviewForm });
            toast.success('Review submitted!');
            dispatch(fetchSingleProduct(id));
            setReviewForm({ rating: 5, title: '', comment: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading || !product) return <Loader />;

    const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
    const displayPrice = selectConvertedPrice(state, product.price);
    const displayComparePrice = product.comparePrice ? selectConvertedPrice(state, product.comparePrice) : null;

    return (
        <div className="min-h-screen bg-white pt-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-dark">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-dark">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-primary-500">{product.category}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Images */}
                    <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="rounded-xl overflow-hidden aspect-square mb-3 border border-gray-200 bg-gray-50">
                            <img
                                src={product.images?.[selectedImage]?.url || 'https://placehold.co/600x600/f5f5f5/999?text=Product'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images?.length > 1 && (
                            <div className="flex gap-2">
                                {product.images.map((img, i) => (
                                    <button key={i} onClick={() => setSelectedImage(i)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary-400' : 'border-gray-200 opacity-60 hover:opacity-100'}`}>
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Info */}
                    <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="badge-info mb-3">{product.category}</span>
                        <h1 className="text-2xl md:text-3xl font-bold text-dark mb-3">{product.name}</h1>

                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <HiStar key={s} className={`w-4.5 h-4.5 ${s <= Math.round(product.ratings) ? 'text-yellow-400' : 'text-gray-200'}`} />
                                ))}
                            </div>
                            <span className="text-gray-500 text-sm">({product.numReviews} reviews)</span>
                        </div>

                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-3xl font-bold text-dark">{displayPrice}</span>
                            {discount > 0 && (
                                <>
                                    <span className="text-lg text-gray-400 line-through">{displayComparePrice}</span>
                                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>
                                </>
                            )}
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-5 text-sm">{product.description}</p>

                        <div className="flex gap-6 mb-5 text-sm">
                            <div><span className="text-gray-500">Brand:</span> <span className="text-dark font-medium">{product.brand}</span></div>
                            <div>
                                <span className="text-gray-500">Stock:</span>{' '}
                                <span className={`font-medium ${product.stock > 5 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-500'}`}>
                                    {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 text-gray-500 hover:text-dark"><HiMinus className="w-4 h-4" /></button>
                                <span className="w-10 text-center text-dark font-semibold">{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2.5 text-gray-500 hover:text-dark"><HiPlus className="w-4 h-4" /></button>
                            </div>
                            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary flex items-center gap-2 flex-1">
                                <HiShoppingCart className="w-5 h-5" /> Add to Cart
                            </button>
                            <button onClick={handleToggleWishlist} className={`p-3 rounded-lg border transition-colors ${isInWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'}`}>
                                {isInWishlist ? <HiHeart className="w-5 h-5" /> : <HiOutlineHeart className="w-5 h-5" />}
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Reviews */}
                <div className="mt-12">
                    <h2 className="text-xl font-bold text-dark mb-6">Customer Reviews</h2>

                    {isAuthenticated && (
                        <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-lg border border-gray-200 p-5 mb-6">
                            <h3 className="text-dark font-semibold text-sm mb-3">Write a Review</h3>
                            <div className="flex items-center gap-0.5 mb-3">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                                        <HiStar className={`w-6 h-6 transition-colors ${s <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`} />
                                    </button>
                                ))}
                            </div>
                            <input value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                                placeholder="Review title (e.g. 'Great product!')" className="input-field mb-3" required />
                            <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                placeholder="Share your experience..." rows={3} className="input-field mb-3" required />
                            <button type="submit" className="btn-primary py-2 px-5 text-sm">Submit Review</button>
                        </form>
                    )}

                    <div className="space-y-3">
                        {reviews.length > 0 ? reviews.map((review) => (
                            <div key={review._id} className="bg-white rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-white text-sm font-bold">
                                        {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="text-dark text-sm font-semibold">{review.user?.name || 'Anonymous'}</p>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <HiStar key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {review.title && <p className="text-dark text-sm font-medium mb-1">{review.title}</p>}
                                <p className="text-gray-600 text-sm">{review.comment}</p>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
