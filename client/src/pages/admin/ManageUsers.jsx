import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiSearch, HiTrash } from 'react-icons/hi';
import { fetchAllUsers, updateUserRole, deleteUser } from '../../features/adminSlice';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const dispatch = useDispatch();
    const { allUsers, loading } = useSelector((s) => s.admin);
    const [search, setSearch] = useState('');

    useEffect(() => { dispatch(fetchAllUsers()); }, [dispatch]);

    const filtered = (allUsers || []).filter((u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const handleRoleChange = async (id, role) => {
        try {
            await dispatch(updateUserRole({ id, role })).unwrap();
            toast.success(`User role updated to ${role}`);
        } catch (err) {
            toast.error(err || 'Failed to update role');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this user?')) {
            try {
                await dispatch(deleteUser(id)).unwrap();
                toast.success('User deleted');
            } catch (err) {
                toast.error(err || 'Failed to delete');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-14">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-dark mb-6">Manage Users</h1>

                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-5">
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-10 w-full" />
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-500 border-b border-gray-200 bg-gray-50">
                                    <th className="text-left py-3 px-4 font-medium">User</th>
                                    <th className="text-left py-3 px-4 font-medium">Email</th>
                                    <th className="text-left py-3 px-4 font-medium">Role</th>
                                    <th className="text-left py-3 px-4 font-medium">Joined</th>
                                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u) => (
                                    <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-white text-xs font-bold">
                                                    {u.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <span className="text-dark">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-500">{u.email}</td>
                                        <td className="py-3 px-4">
                                            <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                className={`text-xs px-2.5 py-1 rounded-full cursor-pointer border-0 font-medium ${u.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="py-3 px-4 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <button onClick={() => handleDelete(u._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><HiTrash /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && <p className="text-gray-500 text-center py-8">No users found</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
