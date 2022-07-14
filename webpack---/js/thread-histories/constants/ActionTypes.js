'use es6';

import {
    createAsyncActionTypes
} from 'conversations-async-data/async-action/createAsyncActionTypes';
export const FETCH_THREAD_HISTORY = createAsyncActionTypes('FETCH_THREAD_HISTORY');
export const REMOVE_MESSAGE_IN_CONVERSATION = 'REMOVE_MESSAGE_IN_CONVERSATION';