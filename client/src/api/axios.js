import axios from 'axios';

const API = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for global error handling
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // If not on login/register page, could redirect
            const isAuthPage = ['/login', '/register'].includes(window.location.pathname);
            if (!isAuthPage && window.location.pathname !== '/') {
                // Optional: dispatch logout or redirect
            }
        }
        return Promise.reject(error);
    }
);

export default API;
