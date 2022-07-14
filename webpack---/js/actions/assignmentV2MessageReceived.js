'use es6';

import {
    getAssignedAgentId,
    getAssignedAgentType
} from 'conversations-message-history/assignment-update-message/operators/assignmentGetters';
import {
    findResponderByIdFromList
} from 'conversations-internal-schema/responders/operators/findResponderByIdFromList';
import {
    fetchAgentResponder
} from '../responders/actions/fetchAgentResponder';
import {
    getAllAgentResponders
} from '../responders/selectors/getAllAgentResponders';
import {
    getSessionId
} from '../selectors/widgetDataSelectors/getSessionId';
import {
    defaultMessageReceived
} from './defaultMessageReceived';
export function assignmentV2MessageReceived(message, channel, threadId) {
    return (dispatch, getState) => {
        const assignedAgentId = getAssignedAgentId(message);
        const responders = getAllAgentResponders(getState());
        const newlyAssignedResponder = findResponderByIdFromList({
            responders,
            responderId: assignedAgentId
        });
        const shouldFetchResponder = assignedAgentId && !newlyAssignedResponder && threadId;

        if (shouldFetchResponder) {
            dispatch(fetchAgentResponder({
                senderId: assignedAgentId,
                agentType: getAssignedAgentType(message),
                sessionId: getSessionId(getState()),
                threadId
            }));
        }

        dispatch(defaultMessageReceived(message, channel, threadId));
    };
}