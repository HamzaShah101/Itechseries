'use es6';

import {
    CLOSED_WELCOME_MESSAGE
} from '../constants/PostMessageTypes';
import {
    postMessageToParent
} from './postMessageToParent';
export const handleClosedWelcomeMessage = data => postMessageToParent(CLOSED_WELCOME_MESSAGE, data);