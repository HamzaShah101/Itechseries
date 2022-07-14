'use es6';

import {
    getWindowLocation
} from './getWindowLocation';
export const getWidgetShellUUID = () => {
    return getWindowLocation().paramValue('uuid');
};