import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiTrash, HiMinus, HiPlus, HiArrowRight, HiShoppingBag } from 'react-icons/hi';
import { fetchCart, updateCartItem, removeFromCart, clearCart, updateLocalQuantity, removeFromLocalCart, clearLocalCart } from '../features/cartSlice';
import toast from 'react-hot-toast';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((s) => s.auth);
    const { items } = useSelector((s) => s.cart);

    useEffect(() => { if (isAuthenticated) dispatch(fetchCart()); }, [dispatch, isAuthenticated]);

    const gp = (item) => item.product || item;
    const gi = (item) => item.product?._id || item.productId || item._id;

    const updQty = (item, q) => {
        if (q < 1) return;
        isAuthenticated ? dispatch(updateCartItem({ productId: gi(item), quantity: q })) : dispatch(updateLocalQuantity({ id: gi(item), quantity: q }));
    };

    const rem = (item) => { isAuthenticated ? dispatch(removeFromCart(gi(item))) : dispatch(removeFromLocalCart(gi(item))); toast.success('Removed'); };
    const clr = () => { isAuthenticated ? dispatch(clearCart()) : dispatch(clearLocalCart()); };

    const sub = items.reduce((s, i) => s + (gp(i)?.price || 0) * (i.quantity || 1), 0);
    const ship = sub > 50 ? 0 : 9.99;
    const tax = sub * 0.08;
    const total = sub + ship + tax;

    if (!items.length) return (
        <div className="min-h-screen pt-14 flex items-center justify-center bg-white">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <HiShoppingBag className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                <h2 className="text-xl font-bold text-dark mb-1">Cart is empty</h2>
                <Link to="/shop" className="btn-primary inline-flex items-center gap-2 mt-3 text-sm">Shop Now <HiArrowRight /></Link>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-14">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-bold text-dark">Shopping Cart</h1>
                    <button onClick={clr} className="text-sm text-gray-500 hover:text-red-500 transition-colors">Clear</button>
                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        {items.map((item, i) => {
                            const p = gp(item); return (
                                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4">
                                    <img src={p?.images?.[0]?.url || 'https://placehold.co/100/f5f5f5/999'} className="w-20 h-20 rounded-lg object-cover border border-gray-100" />
                                    <div className="flex-1"><p className="text-dark font-medium text-sm">{p?.name}</p><p className="text-base font-bold text-dark mt-1">${p?.price?.toFixed(2)}</p></div>
                                    <div className="flex flex-col items-end justify-between">
                                        <button onClick={() => rem(item)} className="text-gray-400 hover:text-red-500 transition-colors"><HiTrash className="w-4 h-4" /></button>
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button onClick={() => updQty(item, (item.quantity || 1) - 1)} className="p-1.5"><HiMinus className="w-3 h-3 text-gray-500" /></button>
                                            <span className="w-8 text-center text-dark text-sm font-medium">{item.quantity || 1}</span>
                                            <button onClick={() => updQty(item, (item.quantity || 1) + 1)} className="p-1.5"><HiPlus className="w-3 h-3 text-gray-500" /></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-20 h-fit">
                        <h3 className="text-base font-bold text-dark mb-4">Summary</h3>
                        <div className="space-y-2.5 text-sm">
                            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${sub.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{ship === 0 ? 'Free' : `$${ship.toFixed(2)}`}</span></div>
                            <div className="flex justify-between text-gray-500"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                            <div className="border-t border-gray-200 pt-2.5 flex justify-between text-dark font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                        </div>
                        <button onClick={() => navigate(isAuthenticated ? '/checkout' : '/login')} className="btn-primary w-full mt-5">Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
