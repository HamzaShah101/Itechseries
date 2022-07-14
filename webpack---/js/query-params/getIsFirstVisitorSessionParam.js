'use es6';

import {
    getWindowLocation
} from './getWindowLocation';
export const getIsFirstVisitorSessionParam = () => {
    return getWindowLocation().paramValue('isFirstVisitorSession') === 'true';
};