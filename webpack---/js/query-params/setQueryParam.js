'use es6';

import {
    getWindowLocation
} from './getWindowLocation';
export const setQueryParam = ({
    key,
    value
}) => {
    const url = getWindowLocation();
    url.upsertParam(key, value);
    window.history.replaceState(null, null, url.search);
};