'use es6';

import {
    getWindowLocation
} from './getWindowLocation';
export const getIsEmbeddedInProduct = () => {
    return getWindowLocation().paramValue('inApp53') === 'true';
};