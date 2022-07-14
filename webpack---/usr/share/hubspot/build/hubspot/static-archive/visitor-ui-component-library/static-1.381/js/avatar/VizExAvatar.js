'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import {
    jsx as _jsx
} from "react/jsx-runtime";
import styled, {
    css
} from 'styled-components';
import PropTypes from 'prop-types';
import {
    MEDIUM,
    LARGE,
    EXTRA_LARGE,
    EXTRA_EXTRA_SMALL,
    EXTRA_SMALL,
    SMALL
} from '../constants/sizes';
import {
    AVATAR_SIZES
} from './constants/AvatarSizes';

const getSizeStyles = ({
    size
}) => {
    const sizePx = AVATAR_SIZES[size];
    return css(["height:", "px;width:", "px;"], sizePx, sizePx);
};

const VizExAvatarWrapper = styled.div.withConfig({
    displayName: "VizExAvatar__VizExAvatarWrapper",
    componentId: "sc-5z2mps-0"
})(["display:inline-flex;align-items:center;justify-content:center;box-sizing:content-box;font-size:initial;overflow:hidden;position:relative;border-radius:50%;", ";"], getSizeStyles);
const VizExAvatarContent = styled.div.withConfig({
    displayName: "VizExAvatar__VizExAvatarContent",
    componentId: "sc-5z2mps-1"
})(["background-image:url(", ");background-position:center center;background-size:cover;height:100%;width:100%;"], ({
    src
}) => `"${src}"`);

const VizExAvatar = props => {
    const {
        size,
        src
    } = props,
    rest = _objectWithoutPropertiesLoose(props, ["size", "src"]);

    return /*#__PURE__*/ _jsx(VizExAvatarWrapper, Object.assign({}, rest, {
        size: size,
        children: /*#__PURE__*/ _jsx(VizExAvatarContent, {
            src: src
        })
    }));
};

VizExAvatar.displayName = 'VizExAvatar';
VizExAvatar.propTypes = {
    size: PropTypes.oneOf([EXTRA_EXTRA_SMALL, EXTRA_SMALL, SMALL, MEDIUM, LARGE, EXTRA_LARGE]),
    src: PropTypes.string.isRequired
};
VizExAvatar.defaultProps = {
    size: MEDIUM
};
export default VizExAvatar;