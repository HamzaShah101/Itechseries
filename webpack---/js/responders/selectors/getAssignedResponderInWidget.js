'use es6';

import {
    createSelector
} from 'reselect';
import {
    findAssignedResponder
} from '../../threads/operators/findAssignedResponder';
import {
    getSelectedThread
} from '../../selected-thread/selectors/getSelectedThread';
import {
    getAgentRespondersList
} from '../../responders/selectors/getAgentRespondersList';
import {
    getWidgetBotResponder
} from '../../selectors/widgetDataSelectors/getWidgetBotResponder';
export const getAssignedResponderInWidget = createSelector([getAgentRespondersList, getSelectedThread, getWidgetBotResponder], (responders, selectedThread, botResponder) => findAssignedResponder({
    thread: selectedThread,
    responders,
    botResponder
}));