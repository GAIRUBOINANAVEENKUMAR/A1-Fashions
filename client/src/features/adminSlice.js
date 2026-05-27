import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const fetchAdminStats = createAsyncThunk('admin/stats', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/users/admin/stats');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
    }
});

export const fetchAllOrders = createAsyncThunk('admin/orders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/orders/admin/all');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
});

export const fetchAllUsers = createAsyncThunk('admin/users', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/users');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
    }
});

export const fetchAllProducts = createAsyncThunk('admin/products', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/products?limit=100');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
});

export const updateOrderStatus = createAsyncThunk('admin/updateOrder', async ({ id, status }, { rejectWithValue }) => {
    try {
        const { data } = await API.put(`/orders/admin/${id}`, { status });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update order');
    }
});

export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
    try {
        await API.delete(`/products/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to delete product');
    }
});

export const createProduct = createAsyncThunk('admin/createProduct', async (data, { rejectWithValue }) => {
    try {
        const { data: res } = await API.post('/products', data);
        return res;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to create product');
    }
});

export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, data }, { rejectWithValue }) => {
    try {
        const { data: res } = await API.put(`/products/${id}`, data);
        return res;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update product');
    }
});

export const uploadProductImages = createAsyncThunk('admin/uploadImages', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const { data } = await API.post(`/products/${id}/images`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to upload images');
    }
});

export const updateUserRole = createAsyncThunk('admin/updateUserRole', async ({ id, role }, { rejectWithValue }) => {
    try {
        const { data } = await API.put(`/users/${id}`, { role });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update user role');
    }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
    try {
        await API.delete(`/users/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to delete user');
    }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        stats: null,
        allOrders: [],
        allUsers: [],
        allProducts: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminStats.pending, (state) => { state.loading = true; })
            .addCase(fetchAdminStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
            })
            .addCase(fetchAdminStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.allOrders = action.payload.orders;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.allUsers = action.payload.users;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.allProducts = action.payload.products;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updated = action.payload.order;
                const idx = state.allOrders.findIndex((o) => o._id === updated._id);
                if (idx !== -1) state.allOrders[idx] = updated;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.allProducts = state.allProducts.filter((p) => p._id !== action.payload);
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.allProducts.unshift(action.payload.product);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const updated = action.payload.product;
                const idx = state.allProducts.findIndex((p) => p._id === updated._id);
                if (idx !== -1) state.allProducts[idx] = updated;
            })
            .addCase(uploadProductImages.fulfilled, (state, action) => {
                const updated = action.payload.product;
                const idx = state.allProducts.findIndex((p) => p._id === updated._id);
                if (idx !== -1) state.allProducts[idx] = updated;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const updated = action.payload.user;
                const idx = state.allUsers.findIndex((u) => u._id === updated._id);
                if (idx !== -1) state.allUsers[idx] = updated;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.allUsers = state.allUsers.filter((u) => u._id !== action.payload);
            });
    },
});

export default adminSlice.reducer;

