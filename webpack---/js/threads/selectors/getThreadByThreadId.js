'use es6';

import get from 'transmute/get';
import {
    createSelector
} from 'reselect';
import {
    getThreads
} from './getThreads';

const threadIdFromProps = (state, {
    threadId
}) => {
    return threadId;
};

export const getThreadByThreadId = createSelector([getThreads, threadIdFromProps], (threadsData, threadId) => {
    return get(threadId, threadsData);
});