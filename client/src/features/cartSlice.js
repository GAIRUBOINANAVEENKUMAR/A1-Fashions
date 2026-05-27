import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/cart');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
    }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
        const { data } = await API.post('/cart/add', { productId, quantity });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
    }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await API.put('/cart/update', { productId, quantity });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update cart');
    }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (productId, { rejectWithValue }) => {
    try {
        const { data } = await API.delete(`/cart/remove/${productId}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to remove from cart');
    }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
    try {
        await API.delete('/cart/clear');
        return { cart: { items: [] } };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
    }
});

// Local cart for non-authenticated users
const getLocalCart = () => {
    try {
        return JSON.parse(localStorage.getItem('shopverse_cart')) || [];
    } catch {
        return [];
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: getLocalCart(),
        loading: false,
        error: null,
    },
    reducers: {
        addToLocalCart: (state, action) => {
            const existing = state.items.find(i => i.product?._id === action.payload._id || i.productId === action.payload._id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ product: action.payload, productId: action.payload._id, quantity: 1 });
            }
            localStorage.setItem('shopverse_cart', JSON.stringify(state.items));
        },
        removeFromLocalCart: (state, action) => {
            state.items = state.items.filter(i => (i.product?._id || i.productId) !== action.payload);
            localStorage.setItem('shopverse_cart', JSON.stringify(state.items));
        },
        updateLocalQuantity: (state, action) => {
            const item = state.items.find(i => (i.product?._id || i.productId) === action.payload.id);
            if (item) item.quantity = action.payload.quantity;
            localStorage.setItem('shopverse_cart', JSON.stringify(state.items));
        },
        clearLocalCart: (state) => {
            state.items = [];
            localStorage.removeItem('shopverse_cart');
        },
    },
    extraReducers: (builder) => {
        const handle = (state, action) => {
            state.loading = false;
            state.items = action.payload.cart.items;
        };
        builder
            .addCase(fetchCart.pending, (state) => { state.loading = true; })
            .addCase(fetchCart.fulfilled, handle)
            .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(addToCart.fulfilled, handle)
            .addCase(updateCartItem.fulfilled, handle)
            .addCase(removeFromCart.fulfilled, handle)
            .addCase(clearCart.fulfilled, handle);
    },
});

export const { addToLocalCart, removeFromLocalCart, updateLocalQuantity, clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
