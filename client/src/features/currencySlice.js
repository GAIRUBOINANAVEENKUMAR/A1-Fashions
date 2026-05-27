import { createSlice } from '@reduxjs/toolkit';

const currencies = {
    USD: { symbol: '$', name: 'US Dollar', rate: 1 },
    EUR: { symbol: '€', name: 'Euro', rate: 0.92 },
    GBP: { symbol: '£', name: 'British Pound', rate: 0.79 },
    INR: { symbol: '₹', name: 'Indian Rupee', rate: 83.12 },
    JPY: { symbol: '¥', name: 'Japanese Yen', rate: 149.50 },
    AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.36 },
    AED: { symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
};

const saved = localStorage.getItem('shopverse_currency') || 'INR';

const currencySlice = createSlice({
    name: 'currency',
    initialState: {
        current: saved,
        currencies,
    },
    reducers: {
        setCurrency: (state, action) => {
            state.current = action.payload;
            localStorage.setItem('shopverse_currency', action.payload);
        },
    },
});

// Selector to convert price
export const selectConvertedPrice = (state, priceUSD) => {
    const { current, currencies } = state.currency;
    const info = currencies[current];
    const converted = (priceUSD * info.rate).toFixed(2);
    return `${info.symbol}${converted}`;
};

export const selectCurrencySymbol = (state) => state.currency.currencies[state.currency.current].symbol;
export const selectCurrencyRate = (state) => state.currency.currencies[state.currency.current].rate;

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
