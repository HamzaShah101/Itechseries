'use es6';

import {
    toggleOpen
} from '../../actions/WidgetActions';
import {
    getPopOpenWidget
} from '../../selectors/widgetDataSelectors/getPopOpenWidget';
import {
    toggleInitialMessageBubble
} from '../../initial-message-bubble/actions/toggleInitialMessageBubble';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
import {
    scrollTriggerEnabled
} from '../../scroll-percentage-trigger/operators/scrollTriggerEnabled';
import {
    postStopTrackScrollPercentage
} from '../../scroll-percentage-trigger/actions/postStopTrackScrollPercentage';
import {
    getIsMobile
} from '../../selectors/getIsMobile';
import {
    getWidgetStartOpen
} from '../../widget-ui/selectors/getWidgetStartOpen';
import {
    shouldOverrideTrigger
} from '../operators/shouldOverrideTrigger';
import {
    getShouldHideWelcomeMessage
} from '../../selectors/getShouldHideWelcomeMessage';
import {
    hasClientTriggerAlreadyFired
} from '../operators/hasClientTriggerAlreadyFired';
export const executeScrollTrigger = () => (dispatch, getState) => {
    postStopTrackScrollPercentage();
    const currentState = getState();
    const widgetData = getLatestWidgetData(currentState);
    const shouldNotOverrideTrigger = !shouldOverrideTrigger(getWidgetStartOpen(currentState));

    if (hasClientTriggerAlreadyFired(getState())) {
        return;
    }

    if (scrollTriggerEnabled(widgetData) && getPopOpenWidget(currentState) && !getIsMobile(currentState) && shouldNotOverrideTrigger) {
        dispatch(toggleOpen({
            isOpened: true
        }));
    } else if (scrollTriggerEnabled(widgetData) && !getShouldHideWelcomeMessage(currentState)) {
        dispatch(toggleInitialMessageBubble(true));
    }
};