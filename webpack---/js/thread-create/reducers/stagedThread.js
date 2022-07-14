'use es6';

import AsyncData from 'conversations-async-data/async-data/AsyncData';
import {
    requestFailedWithError
} from 'conversations-async-data/async-data/operators/requestFailedWithError';
import {
    requestStarted
} from 'conversations-async-data/async-data/operators/requestStarted';
import {
    requestSucceeded
} from 'conversations-async-data/async-data/operators/requestSucceeded';
import {
    updateAsyncData
} from 'conversations-async-data/async-data/operators/updateAsyncData';
import {
    getId
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import ThreadHistory from 'conversations-message-history/thread-history/records/ThreadHistory';
import {
    handleActions
} from 'flux-actions';
import {
    RESET_STUBBED_THREAD,
    STAGE_MESSAGE_ON_STUBBED_THREAD
} from '../../stubbed-thread-history/constants/StubbedThreadHistoryActionTypes';
import {
    addMessageToThreadHistory
} from '../../thread-histories/operators/addMessageToThreadHistory';
import {
    CREATE_NEW_THREAD
} from '../constants/actionTypes';
const initialState = AsyncData({
    data: new ThreadHistory()
});
export const stagedThread = handleActions({
    [STAGE_MESSAGE_ON_STUBBED_THREAD](state, action) {
        const {
            message
        } = action.payload;
        return updateAsyncData(history => addMessageToThreadHistory(getId(message), message, history), state);
    },

    [RESET_STUBBED_THREAD]() {
        return initialState;
    },

    [CREATE_NEW_THREAD.STARTED]: requestStarted,
    [CREATE_NEW_THREAD.SUCCEEDED]: requestSucceeded,
    [CREATE_NEW_THREAD.FAILED]: (state, action) => requestFailedWithError(action.payload, state)
}, initialState);