'use es6';

import {
    getWindowLocation
} from './getWindowLocation';
export const getWindowUrl = () => {
    // eslint-disable-next-line compat/compat
    return new URL(getWindowLocation().paramValue('url'));
};