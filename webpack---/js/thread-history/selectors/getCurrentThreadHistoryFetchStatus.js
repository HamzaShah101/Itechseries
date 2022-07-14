'use es6';

import {
    getStatus
} from 'conversations-async-data/async-data/operators/getters';
import {
    createSelector
} from 'reselect';
import {
    getCurrentThreadHistoryEntry
} from './getCurrentThreadHistoryEntry';
export const getCurrentThreadHistoryFetchStatus = createSelector(getCurrentThreadHistoryEntry, getStatus);