'use es6';

import {
    createSelector
} from 'reselect';
import getIn from 'transmute/getIn';
import {
    getWidgetUiState
} from './getWidgetUiState';
export const getUserInteractedWithWidget = createSelector([getWidgetUiState], getIn(['userInteractedWithWidget']));