import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiSearch, HiPhotograph, HiX, HiUpload, HiLink } from 'react-icons/hi';
import { fetchAllProducts, deleteProduct, createProduct, updateProduct, uploadProductImages } from '../../features/adminSlice';
import { selectConvertedPrice } from '../../features/currencySlice';
import toast from 'react-hot-toast';

const categories = ['Electronics', 'Clothing', 'Footwear', 'Accessories', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Other'];

const ManageProducts = () => {
    const dispatch = useDispatch();
    const { allProducts, loading } = useSelector((s) => s.admin);
    const state = useSelector((s) => s);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', comparePrice: '', category: '', brand: '', stock: '', tags: '' });
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [uploadMode, setUploadMode] = useState('file');
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);

    useEffect(() => { dispatch(fetchAllProducts()); }, [dispatch]);

    const filtered = (allProducts || []).filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const total = imagePreviews.length + files.length;
        if (total > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }
        // Build previews for each file
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, { src: reader.result, name: file.name, isUrl: false }]);
                setImageFiles((prev) => [...prev, file]);
            };
            reader.readAsDataURL(file);
        });
        // Reset the input so the same file can be re-selected
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleAddUrl = () => {
        if (!imageUrl.trim()) return;
        if (imagePreviews.length >= 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }
        setImagePreviews((prev) => [...prev, { src: imageUrl.trim(), name: 'URL Image', isUrl: true }]);
        setImageUrl('');
    };

    const removePreview = (idx) => {
        const preview = imagePreviews[idx];
        setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
        // For file-based previews, remove the corresponding file entry
        if (!preview?.isUrl) {
            // Count how many file-based previews are before this index
            let fileIdx = 0;
            for (let i = 0; i < idx; i++) {
                if (!imagePreviews[i]?.isUrl) fileIdx++;
            }
            setImageFiles((prev) => prev.filter((_, i) => i !== fileIdx));
        }
    };

    const resetForm = () => {
        setForm({ name: '', description: '', price: '', comparePrice: '', category: '', brand: '', stock: '', tags: '' });
        setImageFiles([]);
        setImagePreviews([]);
        setImageUrl('');
        setEditProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            price: Number(form.price),
            comparePrice: Number(form.comparePrice),
            stock: Number(form.stock),
            tags: form.tags?.split(',').map((t) => t.trim()).filter(Boolean),
        };

        try {
            let productId;
            if (editProduct) {
                await dispatch(updateProduct({ id: editProduct._id, data: payload })).unwrap();
                productId = editProduct._id;
                toast.success('Product updated');
            } else {
                const res = await dispatch(createProduct(payload)).unwrap();
                productId = res.product._id;
                toast.success('Product created');
            }

            // Upload file images
            const urlImages = imagePreviews.filter((p) => p.isUrl);

            if (imageFiles.length > 0) {
                setUploading(true);
                const formData = new FormData();
                imageFiles.forEach((f) => formData.append('images', f));
                await dispatch(uploadProductImages({ id: productId, formData })).unwrap();
                toast.success('Images uploaded successfully!');
                setUploading(false);
            } else if (urlImages.length > 0) {
                const imageData = urlImages.map((u) => ({ public_id: `url_${Date.now()}_${Math.random().toString(36).slice(2)}`, url: u.src }));
                await dispatch(updateProduct({ id: productId, data: { images: imageData } })).unwrap();
                toast.success('Image URLs saved!');
            }

            setShowModal(false);
            resetForm();
            dispatch(fetchAllProducts());
        } catch (err) {
            setUploading(false);
            toast.error(err || 'Operation failed');
        }
    };

    const handleEdit = (p) => {
        setEditProduct(p);
        setForm({ name: p.name, description: p.description, price: p.price, comparePrice: p.comparePrice || '', category: p.category, brand: p.brand || '', stock: p.stock, tags: p.tags?.join(', ') || '' });
        setImagePreviews(p.images?.map((img) => ({ src: img.url, name: 'Existing', isUrl: true })) || []);
        setImageFiles([]);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product?')) {
            try {
                await dispatch(deleteProduct(id)).unwrap();
                toast.success('Product deleted');
            } catch (err) {
                toast.error(err || 'Failed to delete');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-14">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-dark">Manage Products</h1>
                    <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2 text-sm">
                        <HiPlus /> Add Product
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-5">
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field pl-10 w-full" />
                    </div>
                </div>

                <p className="text-gray-500 text-sm mb-3">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>

                {/* Products Grid */}
                <div className="grid gap-3">
                    {filtered.map((p) => (
                        <div key={p._id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                            <img src={p.images?.[0]?.url || 'https://placehold.co/80x80/f5f5f5/999?text=P'} alt={p.name}
                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                                onError={(e) => { e.target.src = 'https://placehold.co/80x80/f5f5f5/999?text=P'; }} />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-dark font-medium text-sm truncate">{p.name}</h3>
                                <p className="text-gray-500 text-xs">{p.category} • Stock: {p.stock} • {p.images?.length || 0} image{(p.images?.length || 0) !== 1 ? 's' : ''}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-dark font-bold text-sm">{selectConvertedPrice(state, p.price)}</p>
                                {p.comparePrice > p.price && <p className="text-gray-400 text-xs line-through">{selectConvertedPrice(state, p.comparePrice)}</p>}
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Edit"><HiPencil /></button>
                                <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete"><HiTrash /></button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && <p className="text-gray-500 text-center py-8">No products found</p>}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowModal(false)}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-lg border border-gray-200 shadow-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-bold text-dark">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                                    <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><HiX className="w-5 h-5" /></button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-3.5">
                                    <input className="input-field w-full" placeholder="Product Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                                    <textarea className="input-field w-full" rows={3} placeholder="Description *" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />

                                    <div className="grid grid-cols-2 gap-3">
                                        <input className="input-field w-full" type="number" step="0.01" placeholder="Price (₹) *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                                        <input className="input-field w-full" type="number" step="0.01" placeholder="Compare Price (₹)" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <select className="input-field w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                                            <option value="">Select Category *</option>
                                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <input className="input-field w-full" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <input className="input-field w-full" type="number" placeholder="Stock *" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                                        <input className="input-field w-full" placeholder="Tags (comma-sep)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                                    </div>

                                    {/* Image Upload */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-semibold text-dark flex items-center gap-2">
                                                <HiPhotograph className="w-4 h-4 text-primary-500" /> Product Images
                                            </h3>
                                            <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
                                                <button type="button" onClick={() => setUploadMode('file')} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${uploadMode === 'file' ? 'bg-white shadow-sm text-dark' : 'text-gray-500 hover:text-dark'}`}>
                                                    <HiUpload className="w-3 h-3 inline mr-1" /> Upload
                                                </button>
                                                <button type="button" onClick={() => setUploadMode('url')} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${uploadMode === 'url' ? 'bg-white shadow-sm text-dark' : 'text-gray-500 hover:text-dark'}`}>
                                                    <HiLink className="w-3 h-3 inline mr-1" /> URL
                                                </button>
                                            </div>
                                        </div>

                                        {uploadMode === 'file' ? (
                                            <div>
                                                <input type="file" ref={fileRef} onChange={handleFileSelect} accept="image/*" multiple className="hidden" />
                                                <button
                                                    type="button"
                                                    onClick={() => fileRef.current?.click()}
                                                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all"
                                                >
                                                    <HiUpload className="w-7 h-7 mx-auto text-gray-400 mb-1.5" />
                                                    <p className="text-gray-500 text-sm">Click to upload images</p>
                                                    <p className="text-gray-400 text-xs mt-0.5">PNG, JPG up to 5MB each • Max 5 images</p>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input
                                                    className="input-field flex-1"
                                                    placeholder="Paste image URL..."
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                />
                                                <button type="button" onClick={handleAddUrl} className="btn-primary px-4 text-sm">Add</button>
                                            </div>
                                        )}

                                        {/* Previews */}
                                        {imagePreviews.length > 0 && (
                                            <div className="grid grid-cols-5 gap-2 mt-3">
                                                {imagePreviews.map((img, idx) => (
                                                    <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100 border border-gray-200">
                                                        <img
                                                            src={img.src}
                                                            alt={img.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = 'https://placehold.co/100x100/f5f5f5/999?text=Error'; }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePreview(idx)}
                                                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <HiX className="w-3 h-3" />
                                                        </button>
                                                        {idx === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-primary-400 text-white px-1.5 py-0.5 rounded font-medium">Main</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2.5 justify-end pt-1">
                                        <button type="button" onClick={() => setShowModal(false)} className="btn-outline text-sm">Cancel</button>
                                        <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2 text-sm">
                                            {uploading ? (
                                                <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Uploading...</>
                                            ) : (
                                                editProduct ? 'Update Product' : 'Create Product'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManageProducts;
