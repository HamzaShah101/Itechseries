'use es6';

import {
    HUMAN as HUMAN_AGENT_TYPE,
    BOT as BOT_AGENT_TYPE
} from 'conversations-message-history/common-message-format/constants/agentTypes';
import {
    BOT as BOT_SENDER_TYPE
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import {
    fetchAgentResponder
} from '../responders/actions/fetchAgentResponder';
import {
    getResponderByIdAndType
} from '../responders/operators/getResponderByIdAndType';
import {
    getResponders
} from '../responders/selectors/getResponders';
import {
    getData
} from 'conversations-async-data/async-data/operators/getters';
import {
    getSessionId
} from '../selectors/widgetDataSelectors/getSessionId';
import {
    getUserId
} from 'conversations-internal-schema/responders/operators/responderGetters';
import {
    getCurrentThreadId
} from '../thread-history/selectors/getCurrentThreadId';

const senderTypeToAgentType = senderType => senderType === BOT_SENDER_TYPE ? BOT_AGENT_TYPE : HUMAN_AGENT_TYPE;

export const fetchAgentResponderIfNecessary = ({
    senderId,
    senderType
}) => {
    return (dispatch, getState) => {
        const responders = getResponders(getState());
        const respondersObject = getResponderByIdAndType({
            responders,
            senderId,
            senderType
        });
        const responder = getData(respondersObject);
        const responderId = getUserId(responder);
        const threadId = getCurrentThreadId(getState());

        if (!senderId || responderId || !threadId) {
            return;
        }

        const agentType = senderTypeToAgentType(senderType);
        dispatch(fetchAgentResponder({
            senderId,
            agentType,
            sessionId: getSessionId(getState()),
            threadId: getCurrentThreadId(getState())
        }));
    };
};