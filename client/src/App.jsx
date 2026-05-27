import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { loadUser } from './features/authSlice';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';
import Analytics from './pages/admin/Analytics';
import NotFound from './pages/NotFound';
import { Loader } from './components/common/Loader';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((s) => s.auth);
    if (loading) return <Loader />;
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useSelector((s) => s.auth);
    if (loading) return <Loader />;
    return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Toaster position="top-center" toastOptions={{
                duration: 3000,
                style: { background: '#1A1A2E', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
            }} />
            <Navbar />
            <main className="pt-0">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
                    <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
                    <Route path="/admin/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;

