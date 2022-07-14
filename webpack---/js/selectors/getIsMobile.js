'use es6';

import {
    createSelector
} from 'reselect';
import {
    getWidgetUiState
} from './getWidgetUiState';
import {
    getIsFullscreen
} from '../widget-ui/operators/getIsFullscreen';
import {
    getMobile
} from '../widget-ui/operators/getMobile';
export const getIsMobile = createSelector([getWidgetUiState], widgetUiState => getMobile(widgetUiState) || getIsFullscreen(widgetUiState));