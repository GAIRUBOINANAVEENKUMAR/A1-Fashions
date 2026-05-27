import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineX, HiMenu } from 'react-icons/hi';
import { fetchProducts } from '../features/productSlice';
import ProductCard from '../components/common/ProductCard';
import { ProductSkeleton } from '../components/common/Loader';

const allCategories = ['All', 'Electronics', 'Clothing', 'Footwear', 'Accessories', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Other'];
const sortOptions = [
    { label: 'Newest', value: '-createdAt' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
    { label: 'Top Rated', value: '-ratings' },
    { label: 'Most Reviewed', value: '-numReviews' },
];

const Shop = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { products, loading, totalPages, currentPage, filteredCount } = useSelector((state) => state.products);

    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [sort, setSort] = useState('-createdAt');
    const [priceRange, setPriceRange] = useState([0, 1000]);

    const [page, setPage] = useState(1);
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => {
        const params = {};
        if (keyword) params.keyword = keyword;
        if (category && category !== 'All') params.category = category;
        if (sort) params.sort = sort;
        if (priceRange[0] > 0) params['price[gte]'] = priceRange[0];
        if (priceRange[1] < 1000) params['price[lte]'] = priceRange[1];
        params.page = page;
        params.limit = 12;
        dispatch(fetchProducts(params));
    }, [dispatch, keyword, category, sort, priceRange, page]);

    const [searchInput, setSearchInput] = useState(keyword);
    useEffect(() => {
        const timer = setTimeout(() => { setKeyword(searchInput); setPage(1); }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setCategory(cat);
        const kw = searchParams.get('keyword');
        if (kw) { setKeyword(kw); setSearchInput(kw); }
    }, []);

    return (
        <div className="min-h-screen bg-white pt-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-4">
                    <span className="hover:text-dark cursor-pointer">Home</span>
                    <span className="mx-2">/</span>
                    <span className="text-dark font-medium">Shop</span>
                    {category !== 'All' && (
                        <><span className="mx-2">/</span><span className="text-primary-500 font-medium">{category}</span></>
                    )}
                </nav>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-dark">Shop</h1>
                        <p className="text-gray-500 text-sm mt-0.5">{filteredCount || 0} products found</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="relative flex-1 md:w-64">
                            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text" value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search products..."
                                className="input-field pl-9 py-2 text-sm"
                            />
                        </div>
                        <select
                            value={sort}
                            onChange={(e) => { setSort(e.target.value); setPage(1); }}
                            className="input-field py-2 w-auto text-sm hidden md:block"
                        >
                            {sortOptions.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                        <button onClick={() => setFilterOpen(!filterOpen)} className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                            <HiMenu className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar */}
                    <motion.aside
                        className={`${filterOpen ? 'fixed inset-0 z-40 bg-black/40' : 'hidden'} md:block md:relative md:bg-transparent md:z-auto`}
                        onClick={(e) => { if (e.target === e.currentTarget) setFilterOpen(false); }}
                    >
                        <div className={`${filterOpen ? 'fixed right-0 top-0 h-full w-72 p-5 overflow-y-auto bg-white' : 'w-56 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scroll-smooth'} rounded-lg border border-gray-200 p-4 space-y-5`}>
                            {filterOpen && (
                                <div className="flex items-center justify-between mb-3 md:hidden">
                                    <h3 className="text-dark font-semibold text-sm">Filters</h3>
                                    <button onClick={() => setFilterOpen(false)}><HiOutlineX className="w-5 h-5 text-gray-400" /></button>
                                </div>
                            )}

                            <div>
                                <h4 className="text-dark text-sm font-semibold mb-2">Category</h4>
                                <div className="space-y-0.5">
                                    {allCategories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => { setCategory(cat); setPage(1); setFilterOpen(false); }}
                                            className={`w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors ${category === cat
                                                ? 'bg-primary-50 text-primary-600 font-medium'
                                                : 'text-gray-600 hover:text-dark hover:bg-gray-50'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <h4 className="text-dark text-sm font-semibold mb-2">Price Range</h4>
                                <div className="flex items-center gap-2">
                                    <input type="number" value={priceRange[0]}
                                        onChange={(e) => { setPriceRange([+e.target.value, priceRange[1]]); setPage(1); }}
                                        className="input-field py-1.5 text-sm text-center w-full" placeholder="Min" />
                                    <span className="text-gray-300">—</span>
                                    <input type="number" value={priceRange[1]}
                                        onChange={(e) => { setPriceRange([priceRange[0], +e.target.value]); setPage(1); }}
                                        className="input-field py-1.5 text-sm text-center w-full" placeholder="Max" />
                                </div>
                            </div>


                        </div>
                    </motion.aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loading
                                ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
                                : products.length > 0
                                    ? products.map((product) => <ProductCard key={product._id} product={product} />)
                                    : (
                                        <div className="col-span-full text-center py-16">
                                            <p className="text-gray-500 text-lg">No products found</p>
                                            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                                        </div>
                                    )
                            }
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-1.5 mt-8">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                                            ? 'bg-primary-400 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
