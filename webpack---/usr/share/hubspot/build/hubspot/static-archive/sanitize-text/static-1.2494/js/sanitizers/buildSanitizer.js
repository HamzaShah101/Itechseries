'use es6';

import Sanitize from 'sanitize'; // For specific documentation on the Sanitize.js library, config, or transformers, see: https://github.com/gbirke/Sanitize.js

export const buildSanitizer = config => {
    return new Sanitize(config);
};