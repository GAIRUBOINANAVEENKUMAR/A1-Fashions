import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import productReducer from './features/productSlice';
import cartReducer from './features/cartSlice';
import orderReducer from './features/orderSlice';
import adminReducer from './features/adminSlice';
import wishlistReducer from './features/wishlistSlice';
import currencyReducer from './features/currencySlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        orders: orderReducer,
        admin: adminReducer,
        wishlist: wishlistReducer,
        currency: currencyReducer,
    },
});

export default store;
