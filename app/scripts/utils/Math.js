/**
 * Custom Math functions
 * @module Math
 */

/**
 * Round decimal numbers.
 *
 * @function
 * @param {number} number
 * @param {number} digits
 *
 * @returns {number}
 */
export const round = (number, digits = 2) => {
  const factor = Math.pow(10, digits);
  return Math.round(number * factor) / factor;
};

/**
 * @function
 * @param {number} number
 * @param {number} digits
 *
 * @returns {number}
 */
export const ceil = (number, digits = 2) => {
  const factor = Math.pow(10, digits);
  return Math.ceil(number * factor) / factor;
};

/**
 * @function
 * @param {number} number
 * @param {number} digits
 *
 * @returns {number}
 */
export const floor = (number, digits = 2) => {
  const factor = Math.pow(10, digits);
  return Math.floor(number * factor) / factor;
};

/**
 * @function
 * @param {number} number
 * @param {number} factor
 *
 * @returns {number}
 */
export const roundByFactor = (number, factor = 10000) => number - (number % factor) + (number % factor > 0 && factor);

/**
 * @function
 * @param {number} number
 * @param {number} divisions
 *
 * @returns {number}
 */
export const getFactor = (number, divisions = 8) => {
  const factors = [10000, 50000, 100000, 250000, 500000, 1000000];

  let starter = 0;
  let divs = (number / factors[starter]);

  while (divs > divisions) {
    starter++;
    divs = (number / factors[starter]);
  }

  return factors[starter];
};

/**
 * Parse math string expressions.
 *
 * @function
 * @param {string} str
 *
 * @returns {number}
 */
export const expr = (str) => {
  const chars = str.split('');
  const n = [];
  const op = [];

  let parsed;
  let index = 0;
  let oplast = true;

  n[index] = '';

  // Parse the string
  for (let c = 0; c < chars.length; c++) {
    if (isNaN(parseInt(chars[c], 10)) && chars[c] !== '.' && !oplast) {
      op[index] = chars[c];
      index++;
      n[index] = '';
      oplast = true;
    }
    else {
      n[index] += chars[c];
      oplast = false;
    }
  }

  // Calculate the expression
  parsed = parseFloat(n[0]);
  for (let o = 0; o < op.length; o++) {
    const num = parseFloat(n[o + 1]);

    switch (op[o]) {
      case '+':
        parsed = parsed + num;
        break;
      case '-':
        parsed = parsed - num;
        break;
      case '*':
        parsed = parsed * num;
        break;
      case '/':
        parsed = parsed / num;
        break;
      default:
        break;
    }
  }

  return parsed;
};
