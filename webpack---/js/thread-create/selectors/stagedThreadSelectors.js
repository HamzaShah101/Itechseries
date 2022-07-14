'use es6';

import get from 'transmute/get';
import {
    createSelector
} from 'reselect';
import {
    getData
} from 'conversations-async-data/async-data/operators/getters';
import {
    isStarted
} from 'conversations-async-data/async-data/operators/statusComparators';
import {
    getMessages
} from 'conversations-message-history/thread-history/operators/getters';
import {
    serialize
} from 'conversations-message-history/common-message/serializers/messageSerializer';
import {
    isTypingMessage
} from 'conversations-message-history/typing-indicator/operators/isTypingMessage';
export const getAsyncStagedThread = get('stagedThread');
export const isCreatingThread = createSelector(getAsyncStagedThread, isStarted);
export const getStagedThreadHistory = createSelector(getAsyncStagedThread, getData);
export const getVisitorInitialThreadHistory = createSelector(getStagedThreadHistory, history => getMessages(history).toList().filterNot(isTypingMessage).map(serialize).toJS());