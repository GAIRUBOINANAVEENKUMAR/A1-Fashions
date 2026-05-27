import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
    try {
        const queryStr = new URLSearchParams(params).toString();
        const { data } = await API.get(`/products?${queryStr}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
});

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/products/featured');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch featured products');
    }
});

export const fetchSingleProduct = createAsyncThunk('products/fetchSingle', async (id, { rejectWithValue }) => {
    try {
        const { data } = await API.get(`/products/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch product');
    }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/products/categories/all');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch categories');
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        featuredProducts: [],
        product: null,
        categories: [],
        totalProducts: 0,
        filteredCount: 0,
        totalPages: 0,
        currentPage: 1,
        loading: false,
        error: null,
    },
    reducers: {
        clearProduct: (state) => { state.product = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => { state.loading = true; })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.totalProducts = action.payload.totalProducts;
                state.filteredCount = action.payload.filteredCount;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchFeaturedProducts.pending, (state) => { state.loading = true; })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.featuredProducts = action.payload.products;
            })
            .addCase(fetchFeaturedProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSingleProduct.pending, (state) => { state.loading = true; })
            .addCase(fetchSingleProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.product;
            })
            .addCase(fetchSingleProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload.categories;
            });
    },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
