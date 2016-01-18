/**
 * localStorage Helper
 * @module Storage
 */

/**
 * Get Item.
 *
 * @function
 * @param {string} name
 * @returns {Object}
 */
export const getItem = (name) => {
  return JSON.parse(localStorage.getItem(name));
};

/**
 * Set Item.
 *
 * @function
 * @param {string} name
 * @param {Object} value
 */
export const setItem = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};

/**
 * Remove Item.
 *
 * @function
 * @param {string} name
 */
export const removeItem = (name) => {
  localStorage.removeItem(name);
};

/**
 * Clear All.
 *
 * @function
 */
export const clearAll = () => {
  localStorage.clear();
};

export default { getItem, setItem, removeItem, clearAll };
