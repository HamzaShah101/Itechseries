'use es6';

import {
    createSelector
} from 'reselect';
import getIn from 'transmute/getIn';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
export const getWidgetLocation = createSelector([getLatestWidgetData], state => getIn(['widgetLocation'], state));