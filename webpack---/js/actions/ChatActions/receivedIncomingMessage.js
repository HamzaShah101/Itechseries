'use es6';

import {
    createAction
} from 'flux-actions';
import {
    isConversationalMessage
} from 'conversations-message-history/common-message/operators/isConversationalMessage';
import {
    getSenderType,
    getSenderId
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import {
    VISITOR,
    AGENT,
    BOT
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    hasNewUnseenMessage
} from '../../last-seen/actions/hasNewUnseenMessage';
import {
    fetchAgentResponderIfNecessary
} from '../../actions/AgentResponderActions';
import {
    isActiveOnThread
} from '../../selectors/clientSelectors/isActiveOnThread';
import {
    getIsOpen
} from '../../selectors/getIsOpen';
export const receivedIncomingMessageAction = createAction(ActionTypes.RECEIVED_INCOMING_MESSAGE, ({
    message,
    channel,
    responder,
    shouldNotify,
    threadId
}) => ({
    message,
    channel,
    responder,
    shouldNotify,
    threadId
}));
export function receivedIncomingMessage({
    message,
    channel,
    responder,
    shouldNotify,
    threadId
}) {
    return (dispatch, getState) => {
        dispatch(receivedIncomingMessageAction({
            message,
            channel,
            responder,
            shouldNotify,
            threadId
        }));
        const widgetClosed = !getIsOpen(getState());
        const notActiveOnThread = !isActiveOnThread(getState(), threadId);
        const senderType = getSenderType(message);
        const senderId = getSenderId(message);

        if (isConversationalMessage(message) && (widgetClosed || notActiveOnThread) && senderType !== VISITOR && shouldNotify) {
            dispatch(hasNewUnseenMessage({
                channel,
                threadId
            }));
        }

        if (senderType === AGENT || senderType === BOT) {
            dispatch(fetchAgentResponderIfNecessary({
                senderId,
                senderType
            }));
        }
    };
}