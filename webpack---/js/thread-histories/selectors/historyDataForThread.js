'use es6';

import {
    createSelector
} from 'reselect';
import {
    OrderedMap
} from 'immutable';
import {
    getData
} from 'conversations-async-data/async-data/operators/getters';
import {
    setMessages
} from 'conversations-message-history/thread-history/operators/setters';
import {
    getMessages
} from 'conversations-message-history/thread-history/operators/getters';
import {
    historyForThread
} from './historyForThread';
import {
    threadFromProps
} from '../../threads/selectors/threadFromProps';
import {
    isPersistedThread
} from '../../threads/operators/isPersistedThread';
import {
    unpublishedMessagesForThread
} from '../../pubsub/selectors/unpublishedMessagesForThread';
import {
    getStagedThreadHistory
} from '../../thread-create/selectors/stagedThreadSelectors';
export const historyDataForThread = createSelector([historyForThread, threadFromProps, getStagedThreadHistory, unpublishedMessagesForThread], (history, thread, stagedThreadHistory, unpublishedMessages) => {
    if (!isPersistedThread(thread)) {
        return stagedThreadHistory;
    }

    const historyData = getData(history);

    if (!historyData) {
        return null;
    }

    const messages = getMessages(historyData) || OrderedMap();
    const fullMessages = messages.concat(unpublishedMessages);
    const fullHistoryData = setMessages(fullMessages, historyData);
    return fullHistoryData;
});