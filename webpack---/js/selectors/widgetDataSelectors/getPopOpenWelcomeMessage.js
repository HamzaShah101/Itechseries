'use es6';

import {
    createSelector
} from 'reselect';
import {
    getWelcomeMessage
} from './getWelcomeMessage';
export const getPopOpenWelcomeMessage = createSelector(getWelcomeMessage, (welcomeMessage = {}) => !!welcomeMessage.popOpenWelcomeMessage);