'use es6';

import {
    createSelector
} from 'reselect';
import {
    getThreads
} from './getThreads';
export const hasPersistedThreads = createSelector(getThreads, threads => !!threads.size);