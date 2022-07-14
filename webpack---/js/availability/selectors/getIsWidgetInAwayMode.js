'use es6';

import {
    createSelector
} from 'reselect';
import {
    widgetIsInAwayMode
} from './widgetIsInAwayMode';
import {
    getIsInOfficeHours
} from './getIsInOfficeHours';
export const getIsWidgetInAwayMode = createSelector([widgetIsInAwayMode, getIsInOfficeHours], (inAwayMode, isInOfficeHours) => Boolean(inAwayMode || !isInOfficeHours));