'use es6';

import {
    createSelector
} from 'reselect';
import {
    getAvailabilityAwayMessage
} from '../../availability/selectors/getAvailabilityAwayMessage';
import {
    getInitialMessageText
} from '../../selectors/widgetDataSelectors/getInitialMessageText';
import {
    getIsBotInAwayMode
} from '../../availability/selectors/getIsBotInAwayMode';
import {
    getAvailabilityOfficeHoursWillReturnMessage
} from '../../availability/selectors/getAvailabilityOfficeHoursWillReturnMessage';
export const getFirstMessageText = createSelector([getAvailabilityAwayMessage, getInitialMessageText, getIsBotInAwayMode, getAvailabilityOfficeHoursWillReturnMessage], (awayMessage, initialMessageText, isBotInAwayMode, availabilityOfficeHoursWillReturnMessage) => {
    if (isBotInAwayMode) {
        return awayMessage || availabilityOfficeHoursWillReturnMessage;
    }

    return awayMessage || initialMessageText;
});