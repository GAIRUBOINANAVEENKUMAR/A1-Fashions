import { useRef, useState, useEffect } from 'react';

/**
 * Custom hook for debounced search
 * @param {string} value - The value to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {string} - The debounced value
 */
export const useDebounce = (value, delay = 300) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Custom hook to track recently viewed products
 * @param {number} maxItems - Maximum number of items to store
 * @returns {[Array, Function]} - [recentlyViewed, addToRecentlyViewed]
 */
export const useRecentlyViewed = (maxItems = 10) => {
    const [items, setItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        } catch {
            return [];
        }
    });

    const addItem = (product) => {
        setItems((prev) => {
            const filtered = prev.filter((p) => p._id !== product._id);
            const updated = [product, ...filtered].slice(0, maxItems);
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
            return updated;
        });
    };

    return [items, addItem];
};

/**
 * Custom hook for intersection observer (lazy loading, animations)
 * @param {Object} options - IntersectionObserver options
 * @returns {[React.RefObject, boolean]} - [ref, isIntersecting]
 */
export const useIntersectionObserver = (options = {}) => {
    const ref = useRef(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, { threshold: 0.1, ...options });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return [ref, isIntersecting];
};

/**
 * Custom hook for local storage with state
 */
export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            setStoredValue(value);
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(e);
        }
    };

    return [storedValue, setValue];
};
