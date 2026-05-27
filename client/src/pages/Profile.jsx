import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useSelector((s) => s.auth);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.put('/auth/profile', { name, email });
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-14">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-dark mb-6">Profile</h1>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-xl bg-primary-400 flex items-center justify-center text-white text-xl font-bold">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-dark font-bold text-lg">{user?.name}</p>
                            <p className="text-gray-500 text-sm">{user?.email}</p>
                            <span className="badge-info mt-1">{user?.role}</span>
                        </div>
                    </div>
                    <form onSubmit={handleUpdate} className="space-y-3.5">
                        <div><label className="text-sm text-gray-500 mb-1 block">Name</label><input value={name} onChange={(e) => setName(e.target.value)} className="input-field" /></div>
                        <div><label className="text-sm text-gray-500 mb-1 block">Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" type="email" /></div>
                        <button type="submit" className="btn-primary text-sm">Update Profile</button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
