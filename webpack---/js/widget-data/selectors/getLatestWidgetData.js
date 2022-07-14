'use es6';

import {
    createSelector
} from 'reselect';
import {
    getData
} from 'conversations-async-data/async-data/operators/getters';
import {
    getWidgetDataAsyncData
} from './getWidgetDataAsyncData';
export const getLatestWidgetData = createSelector(getWidgetDataAsyncData, widgetDataAsyncData => getData(widgetDataAsyncData));