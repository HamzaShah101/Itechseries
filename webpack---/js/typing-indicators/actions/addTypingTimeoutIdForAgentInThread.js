'use es6';

import {
    createAction
} from 'flux-actions';
import {
    ADD_TYPING_TIMEOUT_ID
} from '../constants/typingIndicatorActionTypes';
export const addTypingTimeoutIdForAgentInThread = createAction(ADD_TYPING_TIMEOUT_ID, (threadId, senderId, timeoutId) => ({
    threadId,
    senderId,
    timeoutId
}));