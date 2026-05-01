/**
 * Generate a consistent cache key from parts
 * @param  {...string} parts - Key components
 * @returns {string} Formatted cache key
 * @example generateCacheKey('tasks', userId, 'p1', 'l10') => 'tasks:userId:p1:l10'
 */
const generateCacheKey = (...parts) => {
  return parts
    .map((part) => (part === undefined || part === null || part === '' ? '_' : String(part)))
    .join(':');
};

module.exports = { generateCacheKey };
