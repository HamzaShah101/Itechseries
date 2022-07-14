'use es6';

import AsyncData from 'conversations-async-data/async-data/AsyncData';
import {
    requestFailedWithOperator
} from 'conversations-async-data/async-data/operators/requestFailedWithOperator';
import {
    requestStartedWithOperator
} from 'conversations-async-data/async-data/operators/requestStartedWithOperator';
import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import {
    deleteEntry
} from 'conversations-async-data/indexed-async-data/operators/deleteEntry';
import {
    updateEntry
} from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import {
    messageKeyInvariant
} from 'conversations-message-history/thread-history/invariants/messageKeyInvariant';
import {
    getId
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import ActivelyPublishing from 'conversations-message-history/unpublished-messages/records/ActivelyPublishing';
import FailedToPublish from 'conversations-message-history/unpublished-messages/records/FailedToPublish';
import {
    handleActions
} from 'flux-actions';
import {
    REMOVE_MESSAGE_IN_CONVERSATION
} from '../../thread-histories/constants/ActionTypes';
import {
    PUBLISH_MESSAGE
} from '../constants/asyncActionTypes';
const initialState = IndexedAsyncData({
    notSetValue: AsyncData({
        data: null
    }),
    // TODO CMF; replace with a proper id invariant
    idTransform: id => id,
    idInvariant: messageKeyInvariant
});
export default handleActions({
    [PUBLISH_MESSAGE.STARTED](state, action) {
        const {
            messageKey,
            threadId,
            channel,
            message
        } = action.payload;
        return updateEntry(messageKey, requestStartedWithOperator(() => ActivelyPublishing({
            threadId,
            channel,
            message
        })), state);
    },

    [PUBLISH_MESSAGE.SUCCEEDED](state, action) {
        const {
            messageKey
        } = action.payload;
        return deleteEntry(messageKey, state);
    },

    [PUBLISH_MESSAGE.FAILED](state, action) {
        const {
            messageKey,
            threadId,
            channel,
            message
        } = action.payload;
        return updateEntry(messageKey, requestFailedWithOperator(() => FailedToPublish({
            threadId,
            channel,
            message
        })), state);
    },

    [REMOVE_MESSAGE_IN_CONVERSATION](state, action) {
        const {
            message
        } = action.payload;
        const messageKey = getId(message);
        return deleteEntry(messageKey, state);
    }

}, initialState);