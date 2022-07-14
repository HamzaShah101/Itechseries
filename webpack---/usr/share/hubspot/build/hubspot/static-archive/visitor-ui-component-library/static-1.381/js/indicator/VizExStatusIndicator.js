'use es6';

import {
    getStatusIndicatorBorderColor,
    getStatusIndicatorOfflineBackgroundColor,
    getStatusIndicatorOnlineBackgroundColor
} from './theme/statusIndicatorThemeOperators';
import styled, {
    css
} from 'styled-components';
import {
    EXTRA_SMALL,
    MEDIUM,
    SMALL
} from '../constants/sizes';
import PropTypes from 'prop-types';
import {
    OFFLINE,
    ONLINE
} from './constants/StatusIndicatorStatus';

const getSizeStyles = ({
    size
}) => {
    switch (size) {
        case EXTRA_SMALL:
            {
                return css(["width:10px;height:10px;"]);
            }

        case MEDIUM:
            {
                return css(["width:13px;height:13px;"]);
            }

        case SMALL:
        default:
            return css(["height:11px;width:11px;"]);
    }
};

const getStatusStyles = ({
    status,
    theme
}) => {
    switch (status) {
        case ONLINE:
            {
                return css(["background:", ";"], getStatusIndicatorOnlineBackgroundColor(theme));
            }

        case OFFLINE:
        default:
            {
                return css(["background:", ";"], getStatusIndicatorOfflineBackgroundColor(theme));
            }
    }
};

const VizExStatusIndicator = styled.div.withConfig({
    displayName: "VizExStatusIndicator",
    componentId: "sc-1dmkhuc-0"
})(["position:relative;display:inline-flex;::after{content:'';position:absolute;right:0;bottom:1px;border-radius:50%;border:2px solid;border-color:", ";", " ", "}"], ({
    theme
}) => getStatusIndicatorBorderColor(theme), getSizeStyles, getStatusStyles);
VizExStatusIndicator.propTypes = {
    size: PropTypes.oneOf([EXTRA_SMALL, MEDIUM, SMALL]),
    status: PropTypes.oneOf([ONLINE, OFFLINE])
};
export default VizExStatusIndicator;