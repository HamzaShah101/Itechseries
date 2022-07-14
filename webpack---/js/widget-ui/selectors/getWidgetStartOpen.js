'use es6';

import {
    createSelector
} from 'reselect';
import {
    getStartOpen
} from '../operators/getStartOpen';
import {
    getWidgetUiState
} from '../../selectors/getWidgetUiState';
export const getWidgetStartOpen = createSelector([getWidgetUiState], widgetUiState => getStartOpen(widgetUiState));