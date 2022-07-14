'use es6';

import {
    getWindowLocation
} from './getWindowLocation';
import {
    setQueryParam
} from './setQueryParam';
export const getHubspotUtk = () => {
    return getWindowLocation().paramValue('hubspotUtk');
};
export const setHubspotUtk = value => {
    setQueryParam({
        key: 'hubspotUtk',
        value
    });
};