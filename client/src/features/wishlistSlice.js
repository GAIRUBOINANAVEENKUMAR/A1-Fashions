import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
    try {
        const { data } = await API.get('/auth/wishlist');
        return data.wishlist;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch wishlist');
    }
});

export const toggleWishlistItem = createAsyncThunk('wishlist/toggle', async (productId, { rejectWithValue }) => {
    try {
        const { data } = await API.put('/auth/wishlist', { productId });
        return data.wishlist;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update wishlist');
    }
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        loading: false,
    },
    reducers: {
        removeFromWishlist: (state, action) => {
            state.items = state.items.filter((p) => p._id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
            })
            .addCase(fetchWishlist.rejected, (state) => { state.loading = false; })
            .addCase(toggleWishlistItem.fulfilled, (state, action) => {
                state.items = action.payload || [];
            });
    },
});

export const { removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
