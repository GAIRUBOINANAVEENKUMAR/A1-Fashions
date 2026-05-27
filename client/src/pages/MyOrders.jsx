import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiShoppingBag } from 'react-icons/hi';
import { fetchMyOrders } from '../features/orderSlice';

const statusColor = { Processing: 'badge-info', Shipped: 'badge-warning', Delivered: 'badge-success', Cancelled: 'badge-danger' };

const MyOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading } = useSelector((s) => s.orders);

    useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

    if (!loading && !orders.length) return (
        <div className="min-h-screen pt-14 flex items-center justify-center bg-white">
            <div className="text-center"><HiShoppingBag className="w-14 h-14 text-gray-300 mx-auto mb-3" /><p className="text-lg text-dark font-medium">No orders yet</p></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-14">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-dark mb-6">My Orders</h1>
                <div className="space-y-3">
                    {orders.map((o, i) => (
                        <motion.div key={o._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                <div>
                                    <p className="text-xs text-gray-500 font-mono">Order #{o._id?.slice(-8)}</p>
                                    <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={statusColor[o.orderStatus] || 'badge-info'}>{o.orderStatus}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {o.orderItems?.map((item, j) => (
                                    <div key={j} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100">
                                        <img src={item.image || 'https://placehold.co/40/f5f5f5/999'} className="w-7 h-7 rounded object-cover" />
                                        <span className="text-xs text-gray-600">{item.name} ×{item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-dark font-bold text-sm">Total: ${o.totalPrice?.toFixed(2)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
