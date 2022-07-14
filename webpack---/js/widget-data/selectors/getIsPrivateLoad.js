'use es6';

import {
    createSelector
} from 'reselect';
import {
    getIsPrivateLoad as getIsPrivateLoadOperator
} from '../operators/getIsPrivateLoad';
import {
    getLatestWidgetData
} from './getLatestWidgetData';
export const getIsPrivateLoad = createSelector(getLatestWidgetData, widgetData => getIsPrivateLoadOperator(widgetData));