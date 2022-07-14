'use es6';

import {
    createSelector
} from 'reselect';
import {
    getAvailabilityAwayMessage
} from './getAvailabilityAwayMessage';
export const widgetIsInAwayMode = createSelector([getAvailabilityAwayMessage], awayMessage => Boolean(awayMessage));