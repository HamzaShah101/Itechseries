'use es6';

import {
    isCloseThreadMessage
} from 'conversations-message-history/thread-status-update/operators/isCloseThreadMessage';
import {
    isOpenThreadMessage
} from 'conversations-message-history/thread-status-update/operators/isOpenThreadMessage';
import {
    isContactAssociationMessage
} from 'conversations-message-history/contact-association-message/operators/isContactAssociationMessage';
import {
    isTypingMessage
} from 'conversations-message-history/typing-indicator/operators/isTypingMessage';
import {
    isCrmObjectLifecycleUpdate
} from 'conversations-message-history/crm-object-lifecycle-update/operators/isCrmObjectLifecycleUpdate';
import {
    isCommonMessageFormat
} from 'conversations-message-history/common-message-format/operators/cmfComparators';
import {
    deserialize
} from 'conversations-message-history/common-message/serializers/messageSerializer';
import {
    assignmentV2MessageReceived
} from '../../actions/assignmentV2MessageReceived';
import {
    defaultMessageReceived
} from '../../actions/defaultMessageReceived';
import {
    resolveAttachmentsForMessage
} from '../../resolved-attachments/actions/resolveAttachmentsForMessage';
import {
    getThreadByThreadId
} from '../../threads/selectors/getThreadByThreadId';
import {
    dismissTypingIndicator
} from '../../typing-indicators/actions/dismissTypingIndicator';
import {
    typingMessageReceived
} from '../../typing-indicators/actions/typingMessageReceived';
import {
    closeThreadMessageReceived
} from './closeThreadMessageReceived';
import {
    openThreadMessageReceived
} from './openThreadMessageReceived';
import {
    channelChangeReceived
} from './changeChannelReceived';
import {
    ChannelChange,
    CHANNEL_CHANGE
} from 'conversations-internal-pub-sub/channel-change/records/ChannelChange';
import {
    getType
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    onContactAssociated
} from './onContactAssociated';
import {
    validateMessageClientType
} from '../util/validateMessageClientType';
import {
    isAssignmentUpdateMessage
} from 'conversations-message-history/assignment-update-message/operators/isAssignmentUpdateMessage';
export const onMessageReceived = ({
    threadId,
    message: pubSubMessage,
    channel,
    publishContext = {}
}) => (dispatch, getState) => {
    const {
        data: messageJson,
        clientId
    } = pubSubMessage;
    const thread = getThreadByThreadId(getState(), {
        threadId
    });

    if (getType(messageJson) === CHANNEL_CHANGE) {
        dispatch(channelChangeReceived({
            channelChange: new ChannelChange(messageJson),
            threadId
        }));
        return;
    }

    const message = deserialize({
        json: messageJson
    });
    validateMessageClientType({
        message,
        clientId
    });

    switch (true) {
        case isCrmObjectLifecycleUpdate(message):
            {
                // NOOP
                break;
            }

        case isCommonMessageFormat(message):
            {
                dispatch(dismissTypingIndicator(message, threadId));
                dispatch(defaultMessageReceived(message, channel, threadId, publishContext));
                dispatch(resolveAttachmentsForMessage({
                    message,
                    threadId
                }));
                break;
            }

        case isAssignmentUpdateMessage(message):
            {
                dispatch(assignmentV2MessageReceived(message, channel, threadId));
                break;
            }

        case isContactAssociationMessage(message):
            {
                onContactAssociated();
                break;
            }

        case isTypingMessage(message):
            {
                if (!publishContext.playback) dispatch(typingMessageReceived(message, threadId));
                break;
            }

        case isCloseThreadMessage(message):
            {
                dispatch(closeThreadMessageReceived({
                    message,
                    thread,
                    channel
                }));
                break;
            }

        case isOpenThreadMessage(message):
            {
                dispatch(openThreadMessageReceived({
                    message,
                    channel,
                    threadId
                }));
                break;
            }

        default:
            {
                dispatch(defaultMessageReceived(message, channel, threadId, publishContext));
            }
    }
};