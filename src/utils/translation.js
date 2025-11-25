/**
 * Get translated content based on current language
 * Falls back to primary content if translation is missing
 * 
 * @param {object} item - The item containing content fields
 * @param {string} field - The field name (e.g., 'title', 'description')
 * @param {string} currentLang - Current language ('en' or 'ar')
 * @returns {string} Translated or fallback content
 */
export const getTranslatedContent = (item, field, currentLang) => {
    if (!item) return '';

    // If Arabic is selected and Arabic translation exists, use it
    if (currentLang === 'ar' && item[`${field}_ar`]) {
        return item[`${field}_ar`];
    }

    // Otherwise, use the primary (English) field
    return item[field] || '';
};

/**
 * Check if a translation exists for a field
 * 
 * @param {object} item - The item containing content fields
 * @param {string} field - The field name
 * @returns {boolean} True if Arabic translation exists
 */
export const hasTranslation = (item, field) => {
    return item && item[`${field}_ar`] && item[`${field}_ar`].trim() !== '';
};
