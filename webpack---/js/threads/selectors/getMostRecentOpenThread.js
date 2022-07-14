'use es6';

import {
    createSelector
} from 'reselect';
import {
    getOpenThreads
} from './getOpenThreads';
export const getMostRecentOpenThread = createSelector([getOpenThreads], openThreads => {
    return openThreads ? openThreads.first() : undefined;
});