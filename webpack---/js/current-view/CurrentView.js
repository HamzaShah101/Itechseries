'use es6';

import {
    jsx as _jsx
} from "react/jsx-runtime";
import PropTypes from 'prop-types';
import {
    Suspense,
    PureComponent
} from 'react';
import {
    THREAD_VIEW,
    THREAD_LIST,
    KNOWLEDGE_BASE
} from 'conversations-visitor-experience-components/visitor-widget/constants/views';
import Views from 'conversations-visitor-experience-components/visitor-widget/proptypes/WidgetViews';
import WidgetPlaceholder from 'conversations-visitor-experience-components/visitor-widget/components/WidgetPlaceholder';
import VisitorWidgetContainer from '../visitor-widget/containers/VisitorWidgetContainer';
import {
    lazyWithPreload
} from '../utils/lazyWithPreload';
import FadeSlideInTransition from '../transition/FadeSlideInTransition';
import {
    withBrowserSizeContext
} from '../containers/withBrowserSizeContext';
export class CurrentView extends PureComponent {
    constructor(props) {
        super(props);
        this.ThreadView = lazyWithPreload(() =>
            import (
                /* webpackChunkName: "CurrentView-ThreadView" */
                '../components/ThreadView'));
        this.KnowledgeBaseContainer = lazyWithPreload(() =>
            import (
                /* webpackChunkName: "CurrentView-KnowledgeBaseContainer" */
                '../knowledge-base/components/KnowledgeBaseContainer'));
        this.ThreadListContainer = lazyWithPreload(() =>
            import (
                /* webpackChunkName: "CurrentView-ThreadListContainer" */
                '../containers/ThreadListContainer'));
    }

    renderView() {
        const {
            currentView
        } = this.props;

        if (!currentView) {
            return null;
        }

        switch (currentView) {
            case THREAD_VIEW:
                return /*#__PURE__*/ _jsx(this.ThreadView, {});

            case KNOWLEDGE_BASE:
                return /*#__PURE__*/ _jsx(this.KnowledgeBaseContainer, {});

            case THREAD_LIST:
                return /*#__PURE__*/ _jsx(this.ThreadListContainer, {});

            default:
                {
                    return /*#__PURE__*/ _jsx(WidgetPlaceholder, {});
                }
        }
    }

    renderContent() {
        const {
            closeWidget,
            browserWindowHeight,
            inline,
            currentView
        } = this.props;
        return /*#__PURE__*/ _jsx("div", {
            style: {
                height: '100%'
            },
            id: "current-view-component",
            children: /*#__PURE__*/ _jsx(VisitorWidgetContainer, {
                browserWindowHeight: browserWindowHeight,
                closeWidget: closeWidget,
                inline: inline,
                view: currentView,
                children: /*#__PURE__*/ _jsx(Suspense, {
                    fallback: /*#__PURE__*/ _jsx(WidgetPlaceholder, {}),
                    children: this.renderView()
                })
            })
        }, "widget");
    }

    render() {
        const {
            onOpenAnimationStarted,
            onCloseAnimationStarted,
            onOpenAnimationFinished,
            onCloseAnimationFinished,
            isOpen,
            mobile
        } = this.props;
        return /*#__PURE__*/ _jsx(FadeSlideInTransition, {
            disabled: mobile,
            duration: 500,
            in: isOpen,
            onEnter: onOpenAnimationStarted,
            onEntered: onOpenAnimationFinished,
            onExit: onCloseAnimationStarted,
            onExited: onCloseAnimationFinished,
            children: this.renderContent()
        });
    }

}
CurrentView.displayName = 'CurrentView';
CurrentView.defaultProps = {
    onAnimationsFinished: () => {},
    onAnimationsStarted: () => {}
};
CurrentView.propTypes = {
    browserWindowHeight: PropTypes.number.isRequired,
    closeWidget: PropTypes.func.isRequired,
    currentView: Views,
    inline: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    mobile: PropTypes.bool,
    onCloseAnimationFinished: PropTypes.func,
    onCloseAnimationStarted: PropTypes.func,
    onOpenAnimationFinished: PropTypes.func,
    onOpenAnimationStarted: PropTypes.func
};
export default withBrowserSizeContext(CurrentView);