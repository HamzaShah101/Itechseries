'use es6';

import {
    createSelector
} from 'reselect';
import {
    getPopOpenWidget as getPopOpenWidgetOperator
} from 'conversations-internal-schema/message/operators/messageGetters';
import {
    getWelcomeMessage
} from './getWelcomeMessage';
export const getPopOpenWidget = createSelector(getWelcomeMessage, (welcomeMessage = {}) => getPopOpenWidgetOperator(welcomeMessage));