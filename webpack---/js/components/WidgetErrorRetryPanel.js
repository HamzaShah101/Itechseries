'use es6';

import {
    jsxs as _jsxs
} from "react/jsx-runtime";
import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    Component
} from 'react';
import PropTypes from 'prop-types';
import VisitorWidgetStyleWrapper from 'conversations-visitor-experience-components/presentation-components/VisitorWidgetStyleWrapper';
import styled from 'styled-components';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import {
    WidgetLocationProp
} from 'conversations-visitor-experience-components/visitor-widget/constants/WidgetLocations';
import VizExLink from 'visitor-ui-component-library/link/VizExLink';
import VizExCloseButton from 'visitor-ui-component-library/button/VizExCloseButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
export const WidgetBodyDiv = styled.div.withConfig({
    displayName: "WidgetErrorRetryPanel__WidgetBodyDiv",
    componentId: "juzt4x-0"
})(["display:flex;flex-direction:column;padding:40px;"]);

class WidgetErrorRetryPanel extends Component {
    render() {
        const {
            inline,
            widgetLocation,
            mobile,
            isOpen,
            onClose
        } = this.props;

        if (!isOpen) {
            return null;
        }

        return /*#__PURE__*/ _jsx(VisitorWidgetStyleWrapper, {
            inline: inline,
            isOpen: true,
            mobile: mobile,
            widgetLocation: widgetLocation,
            browserWindowHeight: 0,
            children: /*#__PURE__*/ _jsxs(WidgetBodyDiv, {
                children: [ /*#__PURE__*/ _jsx("h4", {
                    children: /*#__PURE__*/ _jsx(FormattedMessage, {
                        message: "conversations-visitor-ui.widgetErrorRetryPanel.title"
                    })
                }), /*#__PURE__*/ _jsx(VizExCloseButton, {
                    onClick: onClose
                }), /*#__PURE__*/ _jsx(FormattedJSXMessage, {
                    message: "conversations-visitor-ui.widgetErrorRetryPanel.body_jsx",
                    elements: {
                        Link: VizExLink
                    },
                    options: {
                        LinkProps: {
                            use: 'on-bright',
                            onClick: this.props.retry
                        }
                    }
                })]
            })
        });
    }

}

WidgetErrorRetryPanel.displayName = 'WidgetErrorRetryPanel';
WidgetErrorRetryPanel.propTypes = {
    inline: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    mobile: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    retry: PropTypes.func.isRequired,
    widgetLocation: WidgetLocationProp
};
export default WidgetErrorRetryPanel;