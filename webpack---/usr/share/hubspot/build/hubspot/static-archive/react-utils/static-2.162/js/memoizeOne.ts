import objectIs from './objectIs';

/**
 * Returns a wrapper function that, when called, either:
 *
 * 1. Returns a cached result if given the same args as the last time it was called, or
 * 2. If any args are different from last time, calls through to `func`
 *
 * @param {Function} func
 * @param {?Function} equalityFn A function of the form `(a, b) => <bool>`
 * @returns {Function}
 */
export default function memoize(func, equalityFn = objectIs) {
  let hasBeenCalled = false;
  let lastArgs;
  let lastResult;
  return function (...args) {
    if (!hasBeenCalled || args.some((arg, i) => !equalityFn(arg, lastArgs[i]))) {
      hasBeenCalled = true;
      lastArgs = args;
      lastResult = func(...args);
    }

    return lastResult;
  };
}