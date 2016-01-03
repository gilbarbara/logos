/**
 * localStorage Helper
 * @module Storage
 */

/**
 * Get Item
 * @method
 * @param {string} name
 * @returns {object}
 */
export let getItem = (name) => {
    return JSON.parse(localStorage.getItem(name));
};

/**
 * Set Item
 * @method
 * @param {string} name
 * @param {object} value
 */
export let setItem = (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
};

/**
 * Remove Item
 * @method
 * @param {string} name
 */
export let removeItem = (name) => {
    localStorage.removeItem(name);
};

/**
 * Clear All
 * @method
 */
export let clearAll = () => {
    localStorage.clear();
};

export default { getItem, setItem, removeItem, clearAll };
