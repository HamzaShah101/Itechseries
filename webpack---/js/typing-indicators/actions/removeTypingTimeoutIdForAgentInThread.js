'use es6';

import {
    createAction
} from 'flux-actions';
import {
    REMOVE_TYPING_TIMEOUT_ID
} from '../constants/typingIndicatorActionTypes';
export const removeTypingTimeoutIdForAgentInThread = createAction(REMOVE_TYPING_TIMEOUT_ID, (threadId, senderId) => ({
    threadId,
    senderId
}));