'use es6';

import {
    createSelector
} from 'reselect';
import {
    getWidgetUiState
} from '../../selectors/getWidgetUiState';
import {
    getAPIEnableWidgetCookieBanner as getAPIEnableWidgetCookieBannerOperator
} from '../operators/getAPIEnableWidgetCookieBanner';
import {
    ON_EXIT_INTENT
} from 'conversations-internal-schema/widget-data/constants/gdprCookieConsentTypes';
export const getAPIEnableWidgetCookieBannerOnExitIntent = createSelector([getWidgetUiState], widgetUiState => getAPIEnableWidgetCookieBannerOperator(widgetUiState) === ON_EXIT_INTENT);