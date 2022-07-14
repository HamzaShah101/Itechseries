'use es6';

import {
    toggleInitialMessageBubble
} from './toggleInitialMessageBubble';
import {
    handleClosedWelcomeMessage
} from '../../post-message/handleClosedWelcomeMessage';
import {
    trackUserInteraction
} from '../../actions/trackUserInteraction';
export const closeInitialMessageBubble = () => dispatch => {
    handleClosedWelcomeMessage();
    dispatch(toggleInitialMessageBubble(false, true));
    dispatch(trackUserInteraction());
};