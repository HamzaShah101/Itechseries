'use es6';

import {
    createSelector
} from 'reselect';
import {
    getEntry
} from 'conversations-async-data/indexed-async-data/operators/getters';
import {
    getThreadId
} from '../../threads/operators/threadGetters';
import {
    getThreadHistories
} from './getThreadHistories';
import {
    threadFromProps
} from '../../threads/selectors/threadFromProps';
export const historyForThread = createSelector([getThreadHistories, threadFromProps], (histories, thread) => {
    const threadId = getThreadId(thread);

    if (typeof threadId !== 'number') {
        return null;
    }

    return getEntry(threadId, histories);
});