import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiCurrencyDollar, HiShoppingBag, HiUsers, HiCube, HiTrendingUp } from 'react-icons/hi';
import { fetchAdminStats } from '../../features/adminSlice';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#FF9900', '#146EB4', '#34D399', '#F59E0B', '#60A5FA', '#A78BFA', '#F472B6', '#F97316'];

const Analytics = () => {
    const dispatch = useDispatch();
    const { stats, loading } = useSelector((s) => s.admin);

    useEffect(() => { dispatch(fetchAdminStats()); }, [dispatch]);

    const revenueData = stats?.monthlyRevenue?.map((m) => ({
        month: m._id, revenue: m.revenue, orders: m.orders,
    })) || [];

    const categoryData = stats?.categoryBreakdown || [];

    const statCards = [
        { key: 'totalRevenue', label: 'Total Revenue', icon: HiCurrencyDollar, bg: 'bg-green-50', color: 'text-green-600', fmt: (v) => `$${(v || 0).toLocaleString()}` },
        { key: 'totalOrders', label: 'Total Orders', icon: HiShoppingBag, bg: 'bg-blue-50', color: 'text-blue-600', fmt: (v) => v || 0 },
        { key: 'totalUsers', label: 'Total Users', icon: HiUsers, bg: 'bg-purple-50', color: 'text-purple-600', fmt: (v) => v || 0 },
        { key: 'totalProducts', label: 'Total Products', icon: HiCube, bg: 'bg-orange-50', color: 'text-orange-600', fmt: (v) => v || 0 },
    ];

    const tooltipStyle = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 };

    return (
        <div className="min-h-screen bg-gray-50 pt-14">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
                    <HiTrendingUp className="text-primary-400" /> Analytics
                </h1>

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

                <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
                    <h2 className="text-base font-bold text-dark mb-4">Monthly Revenue</h2>
                    <div className="h-64">
                        <ResponsiveContainer>
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF9900" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#FF9900" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#999" fontSize={12} />
                                <YAxis stroke="#999" fontSize={12} />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Area type="monotone" dataKey="revenue" stroke="#FF9900" fill="url(#revGrad2)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-5">
                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <h2 className="text-base font-bold text-dark mb-4">Monthly Orders</h2>
                        <div className="h-56">
                            <ResponsiveContainer>
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="month" stroke="#999" fontSize={12} />
                                    <YAxis stroke="#999" fontSize={12} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Bar dataKey="orders" fill="#146EB4" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-5">
                        <h2 className="text-base font-bold text-dark mb-4">Products by Category</h2>
                        <div className="h-56">
                            {categoryData.length > 0 ? (
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={categoryData} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label>
                                            {categoryData.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={tooltipStyle} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">No category data available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
