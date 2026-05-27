import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiSearch, HiEye } from 'react-icons/hi';
import { fetchAllOrders, updateOrderStatus } from '../../features/adminSlice';
import toast from 'react-hot-toast';

const statusColors = {
    Processing: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
};

const ManageOrders = () => {
    const dispatch = useDispatch();
    const { allOrders, loading } = useSelector((s) => s.admin);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => { dispatch(fetchAllOrders()); }, [dispatch]);

    const filtered = (allOrders || []).filter((o) => {
        const matchSearch = !search || o._id?.includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || o.orderStatus === filterStatus;
        return matchSearch && matchStatus;
    });

    const handleStatusChange = async (id, status) => {
        try {
            await dispatch(updateOrderStatus({ id, status })).unwrap();
            toast.success(`Order status updated to ${status}`);
        } catch (err) {
            toast.error(err || 'Failed to update');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-14">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-dark mb-6">Manage Orders</h1>

                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-5 flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ID or customer..." className="input-field pl-10 w-full" />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto">
                        <option value="">All Statuses</option>
                        {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-500 border-b border-gray-200 bg-gray-50">
                                    <th className="text-left py-3 px-4 font-medium">Order ID</th>
                                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                                    <th className="text-left py-3 px-4 font-medium">Items</th>
                                    <th className="text-left py-3 px-4 font-medium">Total</th>
                                    <th className="text-left py-3 px-4 font-medium">Status</th>
                                    <th className="text-left py-3 px-4 font-medium">Date</th>
                                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((o, i) => (
                                    <tr key={o._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-gray-500 font-mono text-xs">#{o._id?.slice(-8)}</td>
                                        <td className="py-3 px-4 text-dark">{o.user?.name || 'N/A'}</td>
                                        <td className="py-3 px-4 text-gray-500">{o.orderItems?.length || 0} items</td>
                                        <td className="py-3 px-4 text-dark font-medium">${o.totalPrice?.toFixed(2)}</td>
                                        <td className="py-3 px-4">
                                            <select value={o.orderStatus} onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                                className={`text-xs px-2.5 py-1 rounded-full cursor-pointer border-0 font-medium ${statusColors[o.orderStatus] || ''}`}>
                                                {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-3 px-4 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <button onClick={() => setSelectedOrder(o)} className="p-1.5 rounded-lg hover:bg-gray-100 text-blue-500"><HiEye /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && <p className="text-gray-500 text-center py-8">No orders found</p>}
                    </div>
                </div>

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedOrder(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-lg border border-gray-200 shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-lg font-bold text-dark mb-4">Order #{selectedOrder._id?.slice(-8)}</h2>
                            <div className="space-y-2.5 text-sm">
                                <div><span className="text-gray-500">Customer:</span> <span className="text-dark">{selectedOrder.user?.name}</span></div>
                                <div><span className="text-gray-500">Email:</span> <span className="text-dark">{selectedOrder.user?.email}</span></div>
                                <div><span className="text-gray-500">Status:</span> <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedOrder.orderStatus]}`}>{selectedOrder.orderStatus}</span></div>
                                <hr className="border-gray-200" />
                                <h3 className="text-dark font-medium">Items</h3>
                                {selectedOrder.orderItems?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span className="text-gray-600">{item.name} × {item.quantity}</span>
                                        <span className="text-dark">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <hr className="border-gray-200" />
                                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="text-dark">${selectedOrder.itemsPrice?.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Tax</span><span className="text-dark">${selectedOrder.taxPrice?.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="text-dark">${selectedOrder.shippingPrice?.toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold"><span className="text-dark">Total</span><span className="text-primary-500">${selectedOrder.totalPrice?.toFixed(2)}</span></div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="btn-outline w-full mt-4 text-sm">Close</button>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;
