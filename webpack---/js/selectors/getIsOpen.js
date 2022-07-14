'use es6';

import {
    createSelector
} from 'reselect';
import getIn from 'transmute/getIn';
import {
    getWidgetUiState
} from './getWidgetUiState';
export const getIsOpen = createSelector([getWidgetUiState], getIn(['open']));