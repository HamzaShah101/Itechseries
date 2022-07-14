'use es6';

import {
    createSelector
} from 'reselect';
import {
    getOpenThreads
} from './getOpenThreads';
export const hasOpenThread = createSelector([getOpenThreads], openThreads => {
    return openThreads.size > 0;
});