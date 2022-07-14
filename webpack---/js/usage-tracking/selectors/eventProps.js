'use es6';

import get from 'transmute/get';
import {
    createSelector
} from 'reselect';
import {
    getPopOpenWelcomeMessage
} from '../../selectors/widgetDataSelectors/getPopOpenWelcomeMessage';
import {
    getIsBot
} from '../../selectors/widgetDataSelectors/getIsBot';
import {
    getUrlForMessage
} from '../../utils/getUrlForMessage';
import {
    widgetState
} from './widgetState';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
export const eventProps = createSelector([widgetState, getIsBot, getPopOpenWelcomeMessage, getLatestWidgetData], (state, botEnabled, promptEnabled, widgetData) => ({
    state,
    botEnabled,
    promptEnabled,
    path: getUrlForMessage(),
    chatflowId: get('chatflowId', widgetData)
}));