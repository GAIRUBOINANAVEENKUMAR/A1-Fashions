/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#4F46E5',
                    500: '#4338CA',
                    600: '#3730A3',
                    700: '#312E81',
                    800: '#23215B',
                    900: '#1E1B4B',
                },
                secondary: {
                    50: '#E6F7FF',
                    100: '#BAE7FF',
                    200: '#91D5FF',
                    300: '#69C0FF',
                    400: '#146EB4',
                    500: '#0F5A99',
                    600: '#0A4A80',
                    700: '#073B66',
                    800: '#042C4D',
                    900: '#021D33',
                },
                dark: {
                    DEFAULT: '#0F1111',
                    50: '#565959',
                    100: '#484B4B',
                    200: '#3A3D3D',
                    300: '#2C2F2F',
                    400: '#1E2121',
                    500: '#0F1111',
                    600: '#0A0B0B',
                    700: '#050606',
                },
                surface: {
                    DEFAULT: '#FFFFFF',
                    light: '#FAFAFA',
                    lighter: '#F5F5F5',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Arial', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'shimmer': 'shimmer 1.5s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    plugins: [],
};
