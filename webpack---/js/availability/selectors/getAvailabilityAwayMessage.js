'use es6';

import {
    createSelector
} from 'reselect';
import {
    getAwayMessage
} from 'conversations-internal-schema/availability/operators/config/availabilityConfigGetters';
import {
    getWidgetAvailabilityOptions
} from './getWidgetAvailabilityOptions';
export const getAvailabilityAwayMessage = createSelector([getWidgetAvailabilityOptions], availabilityOptions => getAwayMessage(availabilityOptions) || '');