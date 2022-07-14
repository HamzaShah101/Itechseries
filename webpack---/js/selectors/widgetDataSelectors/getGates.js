'use es6';

import {
    createSelector
} from 'reselect';
import get from 'transmute/get';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
export const getGates = createSelector([getLatestWidgetData], get('gates'));