/**
 * Returns a wrapper function that, when called, either:
 *
 * 1. Returns the last cached result from `func` for the given arg, or
 * 2. If no cached result is available, calls through to `func`
 *
 * Cache lookups are performed by stringifying the first arg to the function. All other args are
 * ignored for caching purposes.
 *
 * @param {Function} func
 * @returns {Function}
 */
export default function memoize(func) {
  const cache = Object.create(null);
  return function (firstArg, ...otherArgs) {
    if (!cache[firstArg]) {
      cache[firstArg] = func(firstArg, ...otherArgs);
    }

    return cache[firstArg];
  };
}