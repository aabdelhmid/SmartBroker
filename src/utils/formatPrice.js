/**
 * Format price in Egyptian Pounds (EGP)
 * - If price < 1,000,000: show full number with commas (e.g., "850,000 EGP")
 * - If price >= 1,000,000: show short format (e.g., "1.2 Million EGP")
 * 
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
import i18n from '../i18n/config';

export const formatPrice = (price) => {
    // Handle invalid or missing price
    if (!price || isNaN(price)) {
        return 'Price not available';
    }

    const numPrice = Number(price);
    const isArabic = i18n.language === 'ar';

    // For prices >= 1 million
    if (numPrice >= 1000000) {
        const millions = numPrice / 1000000;
        // Remove trailing zeros after decimal point
        const formatted = millions % 1 === 0
            ? millions.toFixed(0)
            : millions.toFixed(2).replace(/\.?0+$/, '');

        return isArabic
            ? `£ ${formatted} مليون`
            : `£ ${formatted} M`;
    }

    // For prices >= 1 thousand
    if (numPrice >= 1000) {
        const thousands = numPrice / 1000;
        const formatted = thousands % 1 === 0
            ? thousands.toFixed(0)
            : thousands.toFixed(1).replace(/\.?0+$/, '');

        return isArabic
            ? `£ ${formatted} ألف`
            : `£ ${formatted} K`;
    }

    // For smaller prices, show full number
    return `£ ${numPrice.toLocaleString('en-US')}`;
};
