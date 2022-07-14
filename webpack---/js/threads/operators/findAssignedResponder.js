'use es6';

import {
    List
} from 'immutable';
import {
    getUserId
} from 'conversations-internal-schema/responders/operators/responderGetters';
import {
    getAssignedAgentId,
    getResponder
} from './threadGetters';
export const findAssignedResponder = ({
    thread,
    responders = List(),
    botResponder
}) => {
    if (!thread && !botResponder) {
        return null;
    }

    const initialAssignedResponder = getResponder(thread);
    const assignedAgent = (responders || List()).find(responder => `${getUserId(responder)}` === `${getAssignedAgentId(thread)}`);
    return assignedAgent || botResponder || initialAssignedResponder || null;
};