'use es6';

import {
    getThreadId
} from '../../threads/operators/threadGetters';
import {
    createSelector
} from 'reselect';
import {
    getSelectedThread
} from '../../selected-thread/selectors/getSelectedThread';
export const getCurrentThreadId = createSelector([getSelectedThread], getThreadId);