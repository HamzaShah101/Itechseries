'use es6';

import I18n from 'I18n';
import {
    createSelector
} from 'reselect';
import {
    getWelcomeMessage
} from './getWelcomeMessage';
export const getAskForEmailMessage = createSelector(getWelcomeMessage, (welcomeMessage = {}) => {
    if (!welcomeMessage.askForEmailMessage) {
        return I18n.text('conversations-visitor-ui.askForEmailMessage');
    }

    return welcomeMessage.askForEmailMessage;
});