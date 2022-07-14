// github.com/facebook/react/blob/master/src/vendor/core/invariant.js

/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */
const invariant = (condition, format, a, b, c, d, e, f) => {
  if (!condition) {
    let error;

    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      const args = [a, b, c, d, e, f];
      let argIndex = 0;
      error = new Error(`Invariant Violation: ${format.replace(/%s/g, () => {
        return args[argIndex++];
      })}`);
    }

    error.framesToPop = 1; // we don't care about invariant's own frame

    throw error;
  }
};

export default invariant;