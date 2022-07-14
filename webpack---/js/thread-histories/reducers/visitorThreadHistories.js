'use es6';

import AsyncData from 'conversations-async-data/async-data/AsyncData';
import {
    requestFailed
} from 'conversations-async-data/async-data/operators/requestFailed';
import {
    requestStarted
} from 'conversations-async-data/async-data/operators/requestStarted';
import {
    requestSucceededWithOperator
} from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import {
    updateAsyncData
} from 'conversations-async-data/async-data/operators/updateAsyncData';
import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import {
    updateEntry
} from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import {
    getId
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    addPageOfMessagesToThreadHistory
} from 'conversations-message-history/thread-history/operators/addPageOfMessagesToThreadHistory';
import {
    removeMessageFromThreadHistory
} from 'conversations-message-history/thread-history/operators/removeMessageFromThreadHistory';
import {
    updateMessageInThreadHistory
} from 'conversations-message-history/thread-history/operators/updateMessageInThreadHistory';
import ThreadHistory from 'conversations-message-history/thread-history/records/ThreadHistory';
import {
    handleActions
} from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    PUBLISH_MESSAGE
} from '../../pubsub/constants/asyncActionTypes';
import {
    CREATE_NEW_THREAD
} from '../../thread-create/constants/actionTypes';
import {
    FETCH_THREAD_HISTORY,
    REMOVE_MESSAGE_IN_CONVERSATION
} from '../constants/ActionTypes';
import {
    addMessageToThreadHistory
} from '../operators/addMessageToThreadHistory';
const initialState = IndexedAsyncData({
    notSetValue: AsyncData({
        data: new ThreadHistory()
    })
});
export default handleActions({
    [CREATE_NEW_THREAD.SUCCEEDED](state, action) {
        const {
            threadId,
            threadHistory
        } = action.payload;
        return updateEntry(threadId, requestSucceededWithOperator(() => threadHistory), state);
    },

    [FETCH_THREAD_HISTORY.STARTED](state, action) {
        const {
            requestArgs
        } = action.payload;
        return updateEntry(requestArgs.threadId, requestStarted, state);
    },

    [FETCH_THREAD_HISTORY.SUCCEEDED](state, action) {
        const {
            requestArgs,
            data: {
                threadHistory: newHistoryPage
            }
        } = action.payload;
        return updateEntry(requestArgs.threadId, requestSucceededWithOperator(addPageOfMessagesToThreadHistory(newHistoryPage)), state);
    },

    [FETCH_THREAD_HISTORY.FAILED](state, action) {
        const {
            requestArgs
        } = action.payload;
        return updateEntry(requestArgs.threadId, requestFailed, state);
    },

    [ActionTypes.RECEIVED_INCOMING_MESSAGE](state, action) {
        const {
            message,
            threadId
        } = action.payload;
        const messageKey = getId(message);
        return updateEntry(threadId, updateAsyncData(addMessageToThreadHistory(messageKey, message)), state);
    },

    [PUBLISH_MESSAGE.SUCCEEDED](state, action) {
        const {
            publishedMessage,
            threadId
        } = action.payload;
        const messageKey = getId(publishedMessage);
        return updateEntry(threadId, updateAsyncData(addMessageToThreadHistory(messageKey, publishedMessage)), state);
    },

    [REMOVE_MESSAGE_IN_CONVERSATION](state, action) {
        const {
            message,
            threadId
        } = action.payload;
        const messageKey = getId(message);
        return updateEntry(threadId, updateAsyncData(removeMessageFromThreadHistory(messageKey, message)), state);
    },

    [ActionTypes.UPDATE_MESSAGE_IN_CONVERSATION](state, action) {
        const {
            message,
            threadId,
            updated
        } = action.payload;
        const messageKey = getId(message);
        return updateEntry(threadId, updateAsyncData(updateMessageInThreadHistory(messageKey, updated)), state);
    }

}, initialState);