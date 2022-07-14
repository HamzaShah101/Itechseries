'use es6';

import {
    createSelector
} from 'reselect';
import {
    getLanguage
} from '../operators/widgetDataGetters';
import {
    getLatestWidgetData
} from './getLatestWidgetData';
export const getWidgetDataLanguage = createSelector(getLatestWidgetData, widgetData => getLanguage(widgetData));