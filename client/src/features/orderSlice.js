import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/orders', orderData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/orders/me');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await API.get(`/orders/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch order');
    }
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        order: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => { state.loading = true; })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload.order;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.order = action.payload.order;
            });
    },
});

export default orderSlice.reducer;
