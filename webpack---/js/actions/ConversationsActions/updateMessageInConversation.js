'use es6';

import {
    createAction
} from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
export const updateMessageInConversation = createAction(ActionTypes.UPDATE_MESSAGE_IN_CONVERSATION, ({
    updated,
    channel,
    message,
    threadId
}) => ({
    updated,
    channel,
    message,
    threadId
}));