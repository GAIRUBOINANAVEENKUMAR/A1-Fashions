import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { createOrder } from '../features/orderSlice';
import { clearCart, clearLocalCart } from '../features/cartSlice';
import toast from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items } = useSelector((s) => s.cart);
    const { user } = useSelector((s) => s.auth);
    const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'US' });

    const gp = (i) => i.product || i;
    const sub = items.reduce((s, i) => s + (gp(i)?.price || 0) * (i.quantity || 1), 0);
    const ship = sub > 50 ? 0 : 9.99;
    const tax = sub * 0.08;
    const total = sub + ship + tax;

    const handlePlace = async (e) => {
        e.preventDefault();
        if (!address.street || !address.city || !address.state || !address.zipCode) return toast.error('Please fill all shipping fields');
        const orderItems = items.map((i) => {
            const p = gp(i);
            return { product: p._id, name: p.name, price: p.price, quantity: i.quantity || 1, image: p.images?.[0]?.url };
        });
        try {
            await dispatch(createOrder({
                orderItems, shippingAddress: address,
                paymentInfo: { id: 'demo_payment', status: 'paid', method: 'demo' },
                itemsPrice: sub, taxPrice: tax, shippingPrice: ship, totalPrice: total,
            })).unwrap();
            dispatch(clearCart());
            dispatch(clearLocalCart());
            toast.success('Order placed successfully!');
            navigate('/order-success');
        } catch (err) {
            toast.error(err || 'Order failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-14">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-dark mb-6">Checkout</h1>
                <form onSubmit={handlePlace} className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <h2 className="text-base font-bold text-dark mb-4">Shipping Address</h2>
                        <div className="space-y-3">
                            {['street', 'city', 'state', 'zipCode', 'country'].map((f) => (
                                <input key={f} name={f} value={address[f]} onChange={(e) => setAddress({ ...address, [f]: e.target.value })}
                                    placeholder={f.charAt(0).toUpperCase() + f.slice(1).replace(/([A-Z])/g, ' $1')} className="input-field" required />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                            <h2 className="text-base font-bold text-dark mb-4">Order Summary</h2>
                            <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto">
                                {items.map((i, idx) => {
                                    const p = gp(i); return (
                                        <div key={idx} className="flex justify-between text-sm"><span className="text-gray-500 truncate mr-2">{p?.name} ×{i.quantity || 1}</span><span className="text-dark">${((p?.price || 0) * (i.quantity || 1)).toFixed(2)}</span></div>
                                    );
                                })}
                            </div>
                            <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${sub.toFixed(2)}</span></div>
                                <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{ship === 0 ? 'Free' : `$${ship.toFixed(2)}`}</span></div>
                                <div className="flex justify-between text-gray-500"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                                <div className="border-t border-gray-200 pt-2 flex justify-between text-dark font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                            </div>
                            <button type="submit" className="btn-primary w-full mt-5">Place Order</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
