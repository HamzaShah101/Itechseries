'use es6';

import {
    createAction
} from 'flux-actions';
import {
    TOGGLE_INITIAL_MESSAGE_BUBBLE
} from '../constants/initialMessageBubbleActionTypes';
export const toggleInitialMessageBubble = createAction(TOGGLE_INITIAL_MESSAGE_BUBBLE, (visible, closedByUser = false) => ({
    visible,
    closedByUser
}));