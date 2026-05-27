/**
 * Format price to currency string
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);
};

/**
 * Calculate discount percentage
 */
export const getDiscountPercentage = (price, comparePrice) => {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round((1 - price / comparePrice) * 100);
};

/**
 * Truncate text to a specific length
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * Get star rating array for rendering
 */
export const getStarArray = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push('full');
        } else if (i - 0.5 <= rating) {
            stars.push('half');
        } else {
            stars.push('empty');
        }
    }
    return stars;
};

/**
 * Generate breadcrumb items from path
 */
export const generateBreadcrumbs = (pathname) => {
    const paths = pathname.split('/').filter(Boolean);
    return paths.map((p, i) => ({
        label: p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' '),
        path: '/' + paths.slice(0, i + 1).join('/'),
    }));
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
