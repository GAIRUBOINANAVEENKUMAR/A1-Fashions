import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiUsers, HiShoppingBag, HiCube, HiCurrencyDollar, HiChartBar, HiClipboardList, HiUserGroup, HiPhotograph } from 'react-icons/hi';
import { fetchAdminStats, fetchAllOrders, fetchAllUsers } from '../features/adminSlice';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const statCards = [
    { key: 'totalRevenue', label: 'Revenue', icon: HiCurrencyDollar, bg: 'bg-green-50', color: 'text-green-600', fmt: (v) => `$${(v || 0).toLocaleString()}` },
    { key: 'totalOrders', label: 'Orders', icon: HiShoppingBag, bg: 'bg-blue-50', color: 'text-blue-600', fmt: (v) => v || 0 },
    { key: 'totalUsers', label: 'Users', icon: HiUsers, bg: 'bg-purple-50', color: 'text-purple-600', fmt: (v) => v || 0 },
    { key: 'totalProducts', label: 'Products', icon: HiCube, bg: 'bg-orange-50', color: 'text-orange-600', fmt: (v) => v || 0 },
];

const quickActions = [
    { label: 'Manage Products', desc: 'Add, edit, delete products & upload images', icon: HiPhotograph, path: '/admin/products', bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'Manage Orders', desc: 'View & update order statuses', icon: HiClipboardList, path: '/admin/orders', bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Manage Users', desc: 'View users, change roles', icon: HiUserGroup, path: '/admin/users', bg: 'bg-pink-50', color: 'text-pink-600' },
    { label: 'Analytics', desc: 'Sales data, top products & trends', icon: HiChartBar, path: '/admin/analytics', bg: 'bg-green-50', color: 'text-green-600' },
];

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, allOrders, allUsers, loading } = useSelector((s) => s.admin);

    useEffect(() => {
        dispatch(fetchAdminStats());
        dispatch(fetchAllOrders());
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const chartData = stats?.monthlyRevenue?.map((m) => ({ month: m._id, revenue: m.revenue, orders: m.orders })) || [];

    return (
        <div className="min-h-screen bg-gray-50 pt-14">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-dark mb-6">Admin Dashboard</h1>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {quickActions.map((action, i) => (
                        <motion.div key={action.path} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                            <Link to={action.path} className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow group">
                                <div className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center mb-2.5`}>
                                    <action.icon className={`w-4.5 h-4.5 ${action.color}`} />
                                </div>
                                <p className="text-dark font-semibold text-sm">{action.label}</p>
                                <p className="text-gray-500 text-xs mt-0.5">{action.desc}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {statCards.map((s, i) => (
                        <motion.div key={s.key} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                            className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-2.5`}>
                                <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                            </div>
                            <p className="text-2xl font-bold text-dark">{s.fmt(stats?.[s.key])}</p>
                            <p className="text-gray-500 text-sm">{s.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
                    <h2 className="text-base font-bold text-dark mb-4">Revenue Trend</h2>
                    <div className="h-64">
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF9900" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#FF9900" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#999" fontSize={12} />
                                <YAxis stroke="#999" fontSize={12} />
                                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                                <Area type="monotone" dataKey="revenue" stroke="#FF9900" fill="url(#revGrad)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
                    <h2 className="text-base font-bold text-dark mb-4">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="text-gray-500 border-b border-gray-200">
                                <th className="text-left py-2.5 px-3 font-medium">Order</th>
                                <th className="text-left py-2.5 px-3 font-medium">Customer</th>
                                <th className="text-left py-2.5 px-3 font-medium">Status</th>
                                <th className="text-right py-2.5 px-3 font-medium">Total</th>
                            </tr></thead>
                            <tbody>
                                {allOrders.slice(0, 10).map((o) => (
                                    <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="py-2.5 px-3 text-gray-500 font-mono text-xs">#{o._id?.slice(-6)}</td>
                                        <td className="py-2.5 px-3 text-dark">{o.user?.name || 'N/A'}</td>
                                        <td className="py-2.5 px-3"><span className={`badge ${o.orderStatus === 'Delivered' ? 'badge-success' : o.orderStatus === 'Cancelled' ? 'badge-danger' : 'badge-info'}`}>{o.orderStatus}</span></td>
                                        <td className="py-2.5 px-3 text-right text-dark font-medium">${o.totalPrice?.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Users */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h2 className="text-base font-bold text-dark mb-4">Users ({allUsers.length})</h2>
                    <div className="space-y-1">
                        {allUsers.slice(0, 10).map((u) => (
                            <div key={u._id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-white text-xs font-bold">{u.name?.charAt(0)}</div>
                                    <div><p className="text-dark text-sm">{u.name}</p><p className="text-gray-500 text-xs">{u.email}</p></div>
                                </div>
                                <span className={u.role === 'admin' ? 'badge-warning' : 'badge-info'}>{u.role}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
