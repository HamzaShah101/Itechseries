'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import {
    jsx as _jsx
} from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, {
    css
} from 'styled-components';
import themePropType from '../utils/themePropType';
import * as IconButtonUses from './constants/IconButtonUses';
import {
    CIRCLE,
    DEFAULT
} from './constants/IconButtonShapes';
import {
    MEDIUM,
    EXTRA_SMALL,
    SMALL
} from '../constants/sizes';
import {
    getColorStyles,
    getBackgroundStyles,
    getHoverBackgroundStyles,
    getActiveBackgroundStyles
} from './utils/getIconButtonStyles';
import {
    BUTTON_SIZES
} from './constants/ButtonSizes';
const StateCss = css(["&:hover{", "}&:active{", "}"], getHoverBackgroundStyles, getActiveBackgroundStyles);
const AbstractVizExIconButton = styled.button.withConfig({
    displayName: "VizExIconButton__AbstractVizExIconButton",
    componentId: "egfmge-0"
})(["flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;border-radius:", ";width:", "px;height:", "px;vertical-align:middle;padding:0;text-align:center;text-overflow:clip;font-size:18px;line-height:18px;outline:none;transition:background-color 150ms ease-out;border-style:solid;border-width:1px;", " ", " user-select:", ";cursor:", " !important;", ";&:focus{outline:0;}> *{user-select:none;}"], ({
    shape
}) => shape === CIRCLE ? '50%' : '3px', ({
    size
}) => BUTTON_SIZES[size] || 40, ({
    size
}) => BUTTON_SIZES[size] || 40, getColorStyles, getBackgroundStyles, ({
    disabled
}) => disabled ? 'none' : null, ({
    disabled
}) => disabled ? 'not-allowed' : 'pointer', ({
    disabled
}) => !disabled ? StateCss : null);

const VizExIconButton = props => {
    const {
        children,
        onClick,
        use,
        theme,
        hover,
        active,
        shape,
        size,
        disabled
    } = props,
    rest = _objectWithoutPropertiesLoose(props, ["children", "onClick", "use", "theme", "hover", "active", "shape", "size", "disabled"]);

    return /*#__PURE__*/ _jsx(AbstractVizExIconButton, Object.assign({}, rest, {
        theme: theme,
        use: use,
        onClick: onClick,
        hover: hover,
        shape: shape,
        active: active,
        disabled: disabled,
        size: size,
        children: children
    }));
};

VizExIconButton.displayName = 'VizExIconButton';
VizExIconButton.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    hover: PropTypes.bool,
    onClick: PropTypes.func,
    shape: PropTypes.oneOf([CIRCLE, DEFAULT]),
    size: PropTypes.oneOf([EXTRA_SMALL, SMALL, MEDIUM]),
    theme: themePropType,
    use: PropTypes.oneOf(Object.values(IconButtonUses))
};
VizExIconButton.defaultProps = {
    use: IconButtonUses.PRIMARY,
    shape: DEFAULT,
    disabled: false,
    size: MEDIUM
};
export default VizExIconButton;