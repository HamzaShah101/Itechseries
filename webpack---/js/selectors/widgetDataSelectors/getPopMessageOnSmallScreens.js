'use es6';

import {
    createSelector
} from 'reselect';
import {
    getWelcomeMessage
} from './getWelcomeMessage';
export const getPopMessageOnSmallScreens = createSelector(getWelcomeMessage, (welcomeMessage = {}) => !!welcomeMessage.popMessageOnSmallScreens);