'use es6';

import {
    gdprCookieConsentPrompt
} from 'conversations-internal-schema/widget-data/operators/gdprCookieConsentPrompt';
import {
    ON_EXIT_INTENT,
    ON_WIDGET_LOAD
} from 'conversations-internal-schema/widget-data/constants/gdprCookieConsentTypes';
import {
    getLatestWidgetData
} from '../widget-data/selectors/getLatestWidgetData';
import {
    getAPIEnableWidgetCookieBannerOnExitIntent
} from '../widget-ui/selectors/getAPIEnableWidgetCookieBannerOnExitIntent';
export const gdprCookieConsentOnExitIntentEnabled = (state, widgetDataOverride) => {
    const latestWidgetData = getLatestWidgetData(state);
    const enableWidgetCookieBannerOnExitIntent = getAPIEnableWidgetCookieBannerOnExitIntent(state);
    return gdprCookieConsentPrompt(widgetDataOverride || latestWidgetData) === ON_EXIT_INTENT || enableWidgetCookieBannerOnExitIntent;
};
export const gdprCookieConsentOnWidgetLoadEnabled = widgetData => {
    return gdprCookieConsentPrompt(widgetData) === ON_WIDGET_LOAD;
};