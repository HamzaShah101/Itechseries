'use es6';

import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    jsxs as _jsxs
} from "react/jsx-runtime";
import {
    Component,
    Fragment
} from 'react';
import PropTypes from 'prop-types';
import {
    findDOMNode
} from 'react-dom';
import classNames from 'classnames';
import {
    WidgetLocationProp,
    LEFT_ALIGNED,
    RIGHT_ALIGNED
} from 'conversations-visitor-experience-components/visitor-widget/constants/WidgetLocations';
import LauncherContainer from '../launcher/container/LauncherContainer';
import InitialMessageBubbleContainer from '../initial-message-bubble/containers/InitialMessageBubbleContainer';
import DebugOverlay from 'conversations-error-reporting/debug-overlay/DebugOverlay';
import WidgetErrorRetryPanel from './WidgetErrorRetryPanel';
import AsyncComponentErrorBoundary from '../code-splitting/AsyncComponentErrorBoundary';
import {
    AVATAR_SIZES
} from 'visitor-ui-component-library/avatar/constants/AvatarSizes';
import {
    SMALL,
    MEDIUM
} from 'visitor-ui-component-library/constants/sizes';
import {
    calculateChatWidgetHeight
} from 'conversations-visitor-experience-components/widget-dimensions/calculateChatWidgetHeight';
import CurrentViewContainer from '../current-view/CurrentViewContainer';
import {
    withBrowserSizeContext
} from '../containers/withBrowserSizeContext';
import {
    BASE_WIDGET_WIDTH,
    BASE_WIDGET_HEIGHT,
    OFFSET_HEIGHT,
    WIDGET_SHADOW_WIDTH,
    LAUNCHER_WIDTH,
    LAUNCHER_HEIGHT
} from 'conversations-visitor-experience-components/widget-dimensions/constants/dimensions';
export class ApplicationLayout extends Component {
    constructor(props) {
        super(props);

        this.onOpenAnimationStarted = () => {
            this.setState({
                animationsFinished: false
            });
            this.props.onIframeResize(this.getIframeDimensions());
        };

        this.onOpenAnimationFinished = () => {
            this.setState({
                animationsFinished: true
            });
        };

        this.onCloseAnimationStarted = () => {
            this.setState({
                animationsFinished: false
            });
        };

        this.onCloseAnimationFinished = () => {
            this.setState({
                animationsFinished: true
            });
            this.props.onIframeResize(this.getIframeDimensions());
        };

        this.getIframeDimensions = this.getIframeDimensions.bind(this);
        this.getAvatarHeightAboveBubble = this.getAvatarHeightAboveBubble.bind(this);
        this.setInitialMessageRef = this.setInitialMessageRef.bind(this);
        this.openWidget = this.openWidget.bind(this);
        this.closeWidget = this.closeWidget.bind(this);
        this.getLauncherBoundingRect = this.getLauncherBoundingRect.bind(this);
        this.getInitialMessageBoundingRect = this.getInitialMessageBoundingRect.bind(this);
        this.getWidgetBoundingRect = this.getWidgetBoundingRect.bind(this);
        this.state = {
            animationsFinished: true
        };
    }

    componentDidMount() {
        this.props.onIframeResize(this.getIframeDimensions(this.props.isOpen));
    }

    getLauncherBoundingRect() {
        const {
            isOpen,
            inline,
            mobile
        } = this.props;
        const launcherHidden = isOpen && mobile || inline;
        return launcherHidden ? {
            width: 0,
            height: 0
        } : {
            width: LAUNCHER_WIDTH,
            height: LAUNCHER_HEIGHT
        };
    }

    getInitialMessageBoundingRect() {
        return this.initialMessageRef ? this.initialMessageRef.getBoundingClientRect() : {
            width: 0,
            height: 0
        };
    }

    getWidgetBoundingRect() {
        const {
            isOpen
        } = this.props;
        return isOpen ? {
            width: BASE_WIDGET_WIDTH + WIDGET_SHADOW_WIDTH,
            height: calculateChatWidgetHeight(this.props.browserWindowHeight, false)
        } : {
            width: 0,
            height: 0
        };
    }

    getAvatarHeightAboveBubble() {
        const avatarHeightPx = this.props.mobile ? AVATAR_SIZES[SMALL] : AVATAR_SIZES[MEDIUM];
        return avatarHeightPx / 2;
    }

    getIframeDimensions(forceOpen) {
        const MARGIN_PX = 16;
        const {
            mobile,
            isOpen: _isOpen
        } = this.props;
        const isOpen = forceOpen || _isOpen; // open widget on mobile takes up the entire screen

        if (isOpen && mobile) {
            return {
                height: this.props.browserWindowHeight,
                width: this.props.browserWindowWidth
            };
        }

        if (isOpen) {
            return {
                height: BASE_WIDGET_HEIGHT + LAUNCHER_HEIGHT + OFFSET_HEIGHT,
                width: BASE_WIDGET_WIDTH + WIDGET_SHADOW_WIDTH
            };
        }

        const activeContent = this.getInitialMessageBoundingRect();
        const launcher = this.getLauncherBoundingRect();
        const avatarHeightAboveBubble = activeContent.height ? this.getAvatarHeightAboveBubble() : 0;
        return {
            width: (activeContent.width || launcher.width) + MARGIN_PX,
            height: launcher.height + activeContent.height + MARGIN_PX + avatarHeightAboveBubble
        };
    }

    setInitialMessageRef(element) {
        this.initialMessageRef = findDOMNode(element);

        if (this.state.animationsFinished) {
            this.props.onIframeResize(this.getIframeDimensions());
        }
    }

    openWidget() {
        this.setState({
            animationsFinished: false
        });
        this.props.trackUserInteraction();
        this.props.onIframeResize(this.getIframeDimensions(true));
        setTimeout(() => {
            this.props.toggleOpen({
                isOpened: true,
                isUser: true
            });
        }, 50);
    }

    closeWidget() {
        this.setState({
            animationsFinished: false
        });
        this.props.trackUserInteraction();
        this.props.toggleOpen({
            isOpened: false,
            isUser: true
        });
    }

    render() {
        const {
            isOpen,
            inline,
            mobile,
            onLauncherHover,
            showInitialMessageBubble,
            widgetLocation
        } = this.props;
        const launcherHidden = isOpen && mobile || inline;
        const launcherAlignmentClasses = {
            [LEFT_ALIGNED]: 'p-right-6 launcher-left-align',
            [RIGHT_ALIGNED]: 'p-left-6 launcher-right-align'
        };
        const launcherWrapperClasses = classNames("p-top-5 display-flex", launcherAlignmentClasses[widgetLocation]);
        return /*#__PURE__*/ _jsxs(Fragment, {
            children: [ /*#__PURE__*/ _jsx(AsyncComponentErrorBoundary, {
                renderError: retry => /*#__PURE__*/ _jsx(WidgetErrorRetryPanel, {
                    inline: inline,
                    isOpen: isOpen,
                    mobile: mobile,
                    widgetLocation: widgetLocation,
                    onClose: this.closeWidget,
                    retry: retry
                }),
                children: /*#__PURE__*/ _jsx(CurrentViewContainer, {
                    inline: inline,
                    isOpen: isOpen,
                    mobile: mobile,
                    onOpenAnimationStarted: this.onOpenAnimationStarted,
                    onCloseAnimationFinished: this.onCloseAnimationFinished,
                    onOpenAnimationFinished: this.onOpenAnimationFinished,
                    onCloseAnimationStarted: this.onCloseAnimationStarted,
                    widgetLocation: widgetLocation,
                    closeWidget: this.closeWidget
                })
            }), showInitialMessageBubble && this.state.animationsFinished && /*#__PURE__*/ _jsx(InitialMessageBubbleContainer, {
                avatarHeightAboveBubble: this.getAvatarHeightAboveBubble(),
                onIframeResize: () => {
                    this.props.onIframeResize(this.getIframeDimensions());
                },
                setInitialMessageRef: this.setInitialMessageRef,
                onClick: this.openWidget,
                widgetLocation: widgetLocation
            }), !launcherHidden && /*#__PURE__*/ _jsx("span", {
                "data-test-id": 'chat-widget-launcher',
                className: launcherWrapperClasses,
                onMouseOver: onLauncherHover,
                children: /*#__PURE__*/ _jsx(LauncherContainer, {
                    onClose: this.closeWidget,
                    onOpen: this.openWidget
                })
            }), /*#__PURE__*/ _jsx(DebugOverlay, {
                onEnterDebug: this.openWidget
            })]
        });
    }

}
ApplicationLayout.displayName = 'ApplicationLayout';
ApplicationLayout.propTypes = {
    browserWindowHeight: PropTypes.number.isRequired,
    browserWindowWidth: PropTypes.number,
    inline: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired,
    mobile: PropTypes.bool.isRequired,
    onIframeResize: PropTypes.func.isRequired,
    onLauncherHover: PropTypes.func.isRequired,
    showInitialMessageBubble: PropTypes.bool.isRequired,
    toggleOpen: PropTypes.func.isRequired,
    trackUserInteraction: PropTypes.func.isRequired,
    widgetLocation: WidgetLocationProp
};
export default withBrowserSizeContext(ApplicationLayout);