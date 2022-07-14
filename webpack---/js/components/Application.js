'use es6';

import {
    jsxs as _jsxs
} from "react/jsx-runtime";
import {
    jsx as _jsx
} from "react/jsx-runtime";
import PropTypes from 'prop-types';
import {
    Component
} from 'react';
import styled, {
    css
} from 'styled-components';
import {
    findDOMNode
} from 'react-dom';
import classNames from 'classnames';
import {
    isHidden
} from 'conversations-visibility-tools/visibility/isHidden';
import {
    addVisibilityChangeListener
} from 'conversations-visibility-tools/visibility/addVisibilityChangeListener';
import {
    removeVisibilityChangeListener
} from 'conversations-visibility-tools/visibility/removeVisibilityChangeListener';
import {
    WidgetLocationProp,
    LEFT_ALIGNED,
    RIGHT_ALIGNED
} from 'conversations-visitor-experience-components/visitor-widget/constants/WidgetLocations';
import {
    WIDGET_DATA,
    REFRESH_WIDGET_DATA,
    REQUEST_OPEN,
    REQUEST_CLOSE,
    BROWSER_WINDOW_RESIZE,
    SCROLL_PERCENTAGE_CHANGE,
    EXIT_INTENT,
    PERF_ATTRIBUTES,
    HUBSPOT_UTK,
    GLOBAL_COOKIE_OPT_OUT,
    FIRST_VISITOR_SESSION,
    TRACK_API_USAGE,
    OPEN_TO_NEW_THREAD
} from '../constants/PostMessageTypes';
import {
    buildWidgetData
} from '../widget-data/operators/buildWidgetData';
import {
    getIsPortal53
} from '../widget-data/operators/getIsPortal53';
import ApplicationLayout from './ApplicationLayout';
import CheckerContainer from '../react-rhumb/containers/CheckerContainer';
import ThemeProvider from './ThemeProvider';
import {
    trackApiInteraction
} from '../usage-tracking/utils/trackApiInteraction';
import {
    handleIframeResize
} from '../post-message/handleIframeResize';
import {
    handleRequestWidget
} from '../post-message/handleRequestWidget';
import {
    defaultBrowserWindowContext,
    BrowserWindowContext
} from './BrowserWindowContext';
import {
    setHubspotUtk
} from '../query-params/hubspotUtk';
import {
    getWindowUrl
} from '../query-params/getWindowUrl';
const WidgetLocationStyles = {
    [LEFT_ALIGNED]: css(["padding-left:16px;padding-right:0;left:0;right:inherit;"]),
    [RIGHT_ALIGNED]: css(["padding-left:0;padding-right:16px;left:inherit;right:0;"])
};
const WidgetAppContainer = styled.div.withConfig({
    displayName: "Application__WidgetAppContainer",
    componentId: "sc-1f2l0a1-0"
})(["&.inline{height:100%;width:100%;padding:0;}", ""], ({
    widgetLocation
}) => WidgetLocationStyles[widgetLocation]);

class Application extends Component {
    constructor(props) {
        super(props);
        this.handleDragover = this.handleDragover.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.registerDragDropHandlers = this.registerDragDropHandlers.bind(this);
        this.unregisterDragDropHandlers = this.unregisterDragDropHandlers.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.registerContainerRef = this.registerContainerRef.bind(this);
        this.getIframeDimensions = this.getIframeDimensions.bind(this);
        this.onIframeResize = this.onIframeResize.bind(this);
        this.onOpenUpdate = this.onOpenUpdate.bind(this);
        this.requestWidget = this.requestWidget.bind(this);
        this.onBrowserWindowResize = this.onBrowserWindowResize.bind(this);
        this.onScrollPercentageChange = this.onScrollPercentageChange.bind(this);
        this.onExitIntent = this.onExitIntent.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.openToNewThread = this.openToNewThread.bind(this);
        this.state = {
            // initially assume the browser is big enough to fit the whole widget
            // then shrink as needed after first paint
            browserWindowHeight: defaultBrowserWindowContext.browserWindowHeight,
            browserWindowWidth: defaultBrowserWindowContext.browserWindowWidth
        };
        this.requestWidget();
    }

    componentDidMount() {
        window.addEventListener('message', this.receiveMessage, false);
        this.registerDragDropHandlers();
        this.onIframeResize();

        if (isHidden()) {
            this.props.setWindowVisible(false);
        }

        addVisibilityChangeListener(this.handleVisibilityChange);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.receiveMessage);
        this.unregisterDragDropHandlers();
        removeVisibilityChangeListener(this.handleVisibilityChange);
    }

    handleDragover(event) {
        event.preventDefault();
    }

    handleDrop(event) {
        event.preventDefault();
    }

    registerDragDropHandlers() {
        window.addEventListener('dragover', this.handleDragover);
        window.addEventListener('drop', this.handleDrop);
    }

    unregisterDragDropHandlers() {
        window.removeEventListener('dragover', this.handleDragover);
        window.removeEventListener('drop', this.handleDrop);
    }

    handleVisibilityChange({
        isVisible
    }) {
        this.props.setWindowVisible(isVisible);
    }

    registerContainerRef(element) {
        this.containerRef = element ? findDOMNode(element) : null;
    }

    getIframeDimensions() {
        const dimensions = this.containerRef ? this.containerRef.getBoundingClientRect() : {};
        const {
            width,
            height
        } = dimensions;
        return {
            width,
            height
        };
    }

    onIframeResize(size) {
        handleIframeResize(size || this.getIframeDimensions());
    }

    onOpenUpdate(isOpened) {
        this.props.toggleOpen({
            isOpened,
            isUser: true
        });
    }

    requestWidget() {
        handleRequestWidget();
    }

    onBrowserWindowResize(data) {
        this.setState({
            browserWindowHeight: data.height,
            browserWindowWidth: data.width
        });
    }

    onScrollPercentageChange(data) {
        this.props.handleScrollPercentageChange({
            scrollPercentage: data.scrollPercentage
        });
    }

    onExitIntent() {
        this.props.executeExitIntentTrigger();
    }

    onTrackApiUsage(data) {
        trackApiInteraction(data.eventName, data.properties);
    }

    openToNewThread() {
        if (!this.props.isViewingStubbedThread) {
            this.props.loadStagedThread();
        }
    }

    handleReceiveWidgetData(widgetData) {
        const {
            handleReceiveWidgetData,
            visitorIdentity
        } = this.props;
        visitorIdentity.setIsPrivateWidgetLoad(widgetData.privateLoad);
        handleReceiveWidgetData({
            data: widgetData,
            isFirstVisitorSession: visitorIdentity.getIsFirstVisitorSession()
        });
    }

    receiveMessage({
        data: rawData,
        origin
    }) {
        if (origin !== getWindowUrl().origin && origin !== window.origin) {
            return;
        }

        let parsedData = null;

        try {
            parsedData = JSON.parse(rawData);
        } catch (err) {
            // unparseable / unexpected message format
            return;
        }

        const {
            type = null,
                data = null
        } = parsedData;

        switch (type) {
            case PERF_ATTRIBUTES:
                {
                    if (window.newrelic && window.newrelic.addPageAction && data.perfAttributes) {
                        window.newrelic.addPageAction('embedScriptPerfAttributes', data.perfAttributes);
                    }

                    break;
                }

            case WIDGET_DATA:
                this.handleReceiveWidgetData(data);
                break;

            case HUBSPOT_UTK:
                setHubspotUtk(data.utk);
                break;

            case GLOBAL_COOKIE_OPT_OUT:
                this.props.onGlobalCookieOptOut(data.globalCookieOptOut);
                break;

            case FIRST_VISITOR_SESSION:
                this.props.updateIsFirstVisitorSession(data.isFirstVisitorSession);
                this.props.visitorIdentity.setIsFirstVisitorSession(data.isFirstVisitorSession);
                break;

            case REFRESH_WIDGET_DATA:
                this.props.refreshWidgetData(buildWidgetData(parsedData.data));
                break;

            case REQUEST_OPEN:
                this.onOpenUpdate(true);
                break;

            case REQUEST_CLOSE:
                this.onOpenUpdate(false);
                break;

            case BROWSER_WINDOW_RESIZE:
                this.onBrowserWindowResize(data);
                break;

            case SCROLL_PERCENTAGE_CHANGE:
                this.onScrollPercentageChange(data);
                break;

            case EXIT_INTENT:
                this.onExitIntent();
                break;

            case TRACK_API_USAGE:
                this.onTrackApiUsage(data);
                break;

            case OPEN_TO_NEW_THREAD:
                this.openToNewThread();
                break;

            default:
                break;
        }
    }

    renderContent() {
        const {
            inline,
            isOpen,
            mobile,
            onLauncherHover,
            showInitialMessageBubble,
            toggleOpen,
            trackUserInteraction,
            widgetLocation
        } = this.props;
        return /*#__PURE__*/ _jsx(BrowserWindowContext.Provider, {
            value: {
                browserWindowHeight: this.state.browserWindowHeight,
                browserWindowWidth: this.state.browserWindowWidth
            },
            children: /*#__PURE__*/ _jsx(ApplicationLayout, {
                inline: inline,
                isOpen: isOpen,
                mobile: mobile,
                onLauncherHover: onLauncherHover,
                onIframeResize: this.onIframeResize,
                showInitialMessageBubble: showInitialMessageBubble,
                toggleOpen: toggleOpen,
                trackUserInteraction: trackUserInteraction,
                widgetLocation: widgetLocation
            })
        });
    }

    render() {
        const {
            shouldRenderContent
        } = this.props;
        const isPortal53 = getIsPortal53();
        const classes = classNames('widget-app-container', this.props.inline && "inline", isPortal53 && 'hs-portal-font');
        return /*#__PURE__*/ _jsxs(WidgetAppContainer, {
            ref: this.registerContainerRef,
            className: classes,
            widgetLocation: this.props.widgetLocation,
            children: [ /*#__PURE__*/ _jsx(CheckerContainer, {}), /*#__PURE__*/ _jsx(ThemeProvider, {
                children: shouldRenderContent ? this.renderContent() : null
            })]
        });
    }

}

Application.displayName = 'Application';
Application.contextType = BrowserWindowContext;
Application.propTypes = {
    executeExitIntentTrigger: PropTypes.func.isRequired,
    handleReceiveWidgetData: PropTypes.func.isRequired,
    handleScrollPercentageChange: PropTypes.func.isRequired,
    inline: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isViewingStubbedThread: PropTypes.bool.isRequired,
    loadStagedThread: PropTypes.func.isRequired,
    mobile: PropTypes.bool.isRequired,
    onGlobalCookieOptOut: PropTypes.func.isRequired,
    onLauncherHover: PropTypes.func.isRequired,
    refreshWidgetData: PropTypes.func.isRequired,
    setWindowVisible: PropTypes.func.isRequired,
    shouldRenderContent: PropTypes.bool.isRequired,
    showInitialMessageBubble: PropTypes.bool.isRequired,
    toggleOpen: PropTypes.func.isRequired,
    trackUserInteraction: PropTypes.func.isRequired,
    updateIsFirstVisitorSession: PropTypes.func.isRequired,
    visitorIdentity: PropTypes.object.isRequired,
    widgetLocation: WidgetLocationProp
};
export default Application;