'use es6';

import {
    connect
} from 'react-redux';
import {
    toggleOpen
} from '../actions/WidgetActions';
import {
    isSucceeded
} from 'conversations-async-data/async-data/operators/statusComparators';
import {
    handleReceiveWidgetData
} from '../widget-data/actions/handleReceiveWidgetData';
import {
    onGlobalCookieOptOut
} from '../visitor-identity/actions/updateGlobalCookieOptOut';
import {
    updateIsFirstVisitorSession
} from '../visitor-identity/actions/updateIsFirstVisitorSession';
import {
    refreshWidgetData
} from '../widget-data/actions/refreshWidgetData';
import {
    setWindowVisible
} from '../actions/WindowActions';
import {
    handleScrollPercentageChange
} from '../scroll-percentage-trigger/actions/handleScrollPercentageChange';
import {
    getIsOpen
} from '../selectors/getIsOpen';
import {
    getIsMobile
} from '../selectors/getIsMobile';
import {
    getWidgetLocation
} from '../selectors/widgetDataSelectors/getWidgetLocation';
import {
    getWidgetDataAsyncData
} from '../widget-data/selectors/getWidgetDataAsyncData';
import {
    trackUserInteraction
} from '../actions/trackUserInteraction';
import Application from '../components/Application';
import {
    preloadThreadViewOrKnowledgeBase
} from '../actions/preloadThreadViewOrKnowledgeBase';
import {
    getShowInitialMessageBubble
} from '../initial-message-bubble/selectors/getShowInitialMessageBubble';
import {
    executeExitIntentTrigger
} from '../client-triggers/actions/executeExitIntentTrigger';
import {
    loadStagedThread
} from '../navigation/actions/loadStagedThread';
import {
    getSelectedThreadId
} from '../selected-thread/selectors/getSelectedThreadId';
import {
    STUBBED_THREAD_ID
} from '../threads/constants/stubbedThreadId';
import {
    ConsumeVisitorIdentityContext
} from '../visitorIdentityContext/VisitorIdentityContext';

const mapStateToProps = state => {
    const widgetDataAsyncData = getWidgetDataAsyncData(state);
    const shouldRenderContent = isSucceeded(widgetDataAsyncData);
    const isViewingStubbedThread = getSelectedThreadId(state) === STUBBED_THREAD_ID;
    return {
        isOpen: getIsOpen(state),
        mobile: getIsMobile(state),
        shouldRenderContent,
        showInitialMessageBubble: getShowInitialMessageBubble(state),
        widgetLocation: getWidgetLocation(state),
        isViewingStubbedThread
    };
};

const mapDispatchToProps = {
    executeExitIntentTrigger,
    updateIsFirstVisitorSession,
    onGlobalCookieOptOut,
    handleReceiveWidgetData,
    handleScrollPercentageChange,
    onLauncherHover: preloadThreadViewOrKnowledgeBase,
    setWindowVisible,
    refreshWidgetData,
    toggleOpen,
    trackUserInteraction,
    loadStagedThread
};
export default ConsumeVisitorIdentityContext(connect(mapStateToProps, mapDispatchToProps)(Application));