'use es6';

import {
    createAction
} from 'flux-actions';
import {
    REMOVE_MESSAGE_IN_CONVERSATION
} from '../constants/ActionTypes';
export const removeMessageInConversation = createAction(REMOVE_MESSAGE_IN_CONVERSATION, ({
    message,
    threadId
}) => ({
    message,
    threadId
}));