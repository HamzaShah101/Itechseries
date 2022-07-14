'use es6';

import {
    createSelector
} from 'reselect';
import {
    getIsOpen
} from './getIsOpen';
import {
    getPopOpenWelcomeMessage
} from './widgetDataSelectors/getPopOpenWelcomeMessage';
import {
    getIsMobile
} from '../selectors/getIsMobile';
import {
    getPopMessageOnSmallScreens
} from './widgetDataSelectors/getPopMessageOnSmallScreens';
import {
    getInitialMessageText
} from './widgetDataSelectors/getInitialMessageText';
import {
    getAvailabilityAwayMessage
} from '../availability/selectors/getAvailabilityAwayMessage';
import {
    getShouldHideWelcomeMessage
} from './getShouldHideWelcomeMessage';
import {
    getPopOpenWidget
} from './widgetDataSelectors/getPopOpenWidget';
export const getShowInitialMessage = createSelector([getPopOpenWelcomeMessage, getPopMessageOnSmallScreens, getInitialMessageText, getAvailabilityAwayMessage, getIsOpen, getIsMobile, getShouldHideWelcomeMessage, getPopOpenWidget], (popOpenWelcomeMessage, popMessageOnSmallScreens, initialMessage, awayMessage, isOpen, isMobile, shouldHideWelcomeMessage, popOpenWidget) => {
    if (shouldHideWelcomeMessage) {
        return false;
    }

    const popMessage = isMobile ? Boolean(popMessageOnSmallScreens) : popOpenWidget || Boolean(popOpenWelcomeMessage);
    return Boolean(popMessage && !!initialMessage && !awayMessage && !isOpen);
});