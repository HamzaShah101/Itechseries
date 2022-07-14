'use es6';
/**
 * Diff arrays of primitive values (numbers, strings, booleans, undefined, null, and symbols)
 *
 * @param {Array} array Array to inspect
 * @param {Array} values Values to exclude
 * @returns {Array} Returns an array of filtered values
 */

export const diffPrimitives = (a, b) => a.filter(x => !b.includes(x));