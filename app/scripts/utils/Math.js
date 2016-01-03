/**
 * Custom Math functions
 * @module Math
 */

/**
 * Round decimal numbers
 * @method
 * @param {number} number
 * @param {number} digits
 *
 * @returns {number}
 */
export let round = (number, digits = 2) => {
    let factor = Math.pow(10, digits);
    return Math.round(number * factor) / factor;
};

/**
 * @method
 * @param {number} number
 * @param {number} digits
 *
 * @returns {number}
 */
export let ceil = (number, digits = 2) => {
    let factor = Math.pow(10, digits);
    return Math.ceil(number * factor) / factor;
};

/**
 * @method
 * @param {number} number
 * @param {number} digits
 *
 * @returns {number}
 */
export let floor = (number, digits = 2) => {
    let factor = Math.pow(10, digits);
    return Math.floor(number * factor) / factor;
};

/**
 * @method
 * @param {number} number
 * @param {number} factor
 *
 * @returns {number}
 */
export let roundByFactor = (number, factor = 10000) => {
    return number - (number % factor) + (number % factor > 0 && factor);
};

/**
 * @method
 * @param {number} number
 * @param {number} divisions
 *
 * @returns {number}
 */
export let getFactor = (number, divisions = 8) => {
    let starter = 0,
        factors = [10000, 50000, 100000, 250000, 500000, 1000000],
        divs    = (number / factors[starter]);

    while (divs > divisions) {
        starter++;
        divs = (number / factors[starter]);
    }

    return factors[starter];
};

/**
 * @method
 * @param {string} str - "10 * 2"
 *
 * @returns {number}
 */
export let expr = (str) => {

    let chars = str.split(''),
        parsed,
        n = [],
        op = [],
        index = 0,
        oplast = true;

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
        let num = parseFloat(n[o + 1]);

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

export default { round, ceil, floor, roundByFactor, getFactor, expr };
