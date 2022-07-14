'use es6';

import {
    getPubSubClient
} from 'conversations-internal-pub-sub/redux/selectors/pubSubClientGetters';
import {
    getQuickReply
} from 'conversations-message-history/common-message-format/operators/cmfQuickReplyGetters';
import {
    getId
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    isConversationalMessage
} from 'conversations-message-history/common-message/operators/isConversationalMessage';
import {
    deserialize,
    serialize
} from 'conversations-message-history/common-message/serializers/messageSerializer';
import {
    isClosed
} from '../../threads/operators/isClosed';
import {
    createAction
} from 'flux-actions';
import Raven from 'Raven';
import {
    updateMessageInConversation
} from '../../actions/ConversationsActions/updateMessageInConversation';
import {
    PUBLISH_MESSAGE
} from '../../pubsub/constants/asyncActionTypes';
import {
    getThreadByThreadId
} from '../../threads/selectors/getThreadByThreadId';
import {
    getCurrentThreadHistoryFetchStatus
} from '../../thread-history/selectors/getCurrentThreadHistoryFetchStatus';
import {
    STARTED
} from 'conversations-async-data/async-data/constants/asyncStatuses';
export const publishMessageStarted = createAction(PUBLISH_MESSAGE.STARTED, ({
    channel,
    message,
    messageKey,
    threadId
}) => ({
    channel,
    message,
    messageKey,
    threadId
}));
export const publishMessageSucceeded = createAction(PUBLISH_MESSAGE.SUCCEEDED, ({
    channel,
    messageKey,
    publishedMessage,
    threadId
}) => ({
    channel,
    messageKey,
    publishedMessage,
    threadId
}));
export const publishMessageFailed = createAction(PUBLISH_MESSAGE.FAILED, ({
    channel,
    messageKey,
    message,
    threadId,
    error
}) => ({
    channel,
    messageKey,
    message,
    threadId,
    error
}));
export const publishMessage = ({
    channel,
    message,
    threadId
}) => (dispatch, getState) => {
    const thread = getThreadByThreadId(getState(), {
        threadId
    });

    if (getCurrentThreadHistoryFetchStatus(getState()) === STARTED) {
        dispatch(publishMessageFailed({
            channel,
            messageKey: getId(message),
            message,
            threadId,
            error: 'message sent while threads fetching'
        }));
        return Promise.resolve();
    }

    if (isClosed(thread)) {
        return Promise.resolve();
    }

    dispatch(publishMessageStarted({
        channel,
        message,
        messageKey: getId(message),
        threadId
    }));
    const client = getPubSubClient(getState());
    const publishData = {
        message: serialize(message),
        channel
    };
    const promise = client.publish(publishData).then(({
        data: json
    }) => {
        const publishedMessage = deserialize({
            json
        });
        dispatch(publishMessageSucceeded({
            channel,
            messageKey: getId(message),
            publishedMessage,
            threadId
        }));
        dispatch(updateMessageInConversation({
            updated: publishedMessage,
            channel,
            message,
            threadId
        }));
    }).catch(error => {
        dispatch(publishMessageFailed({
            channel,
            messageKey: getId(message),
            message,
            threadId,
            error
        }));
    });

    try {
        const isQuickReplyResponse = Boolean(getQuickReply(message));

        if (isConversationalMessage(message) && !isQuickReplyResponse && isClosed(thread)) {
            Raven.captureMessage('VISITOR_MESSAGE_PUBLISHED_ON_CLOSED_THREAD', {
                extra: {
                    threadId,
                    publishData
                }
            });
        }
    } catch (e) { // error
    }

    promise.done();
    return promise;
};