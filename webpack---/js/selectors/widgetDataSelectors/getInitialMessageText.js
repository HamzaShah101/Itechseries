'use es6';

import {
    createSelector
} from 'reselect';
import get from 'transmute/get';
import {
    getWelcomeMessage
} from './getWelcomeMessage';
export const getInitialMessageText = createSelector(getWelcomeMessage, get('initialMessage'));