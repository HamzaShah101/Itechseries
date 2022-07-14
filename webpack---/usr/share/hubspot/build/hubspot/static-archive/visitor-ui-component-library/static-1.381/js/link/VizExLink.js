'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import {
    jsx as _jsx
} from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled, {
    css
} from 'styled-components';
import {
    getLinkStyles as getDefaultLinkStyles
} from './utils/getLinkStyles';
import themePropType from '../utils/themePropType';
import {
    ON_BRIGHT,
    DEFAULT,
    ERROR
} from './constants/LinkVariations';
import {
    getOnBrightLinkTextColor,
    getLinkTextColor,
    getErrorTextColor
} from './theme/linkThemeOperators';
export const getLinkStyles = props => {
    switch (props.use) {
        case ON_BRIGHT:
            return css(["", ";text-decoration:underline;"], getDefaultLinkStyles(Object.assign({}, props, {
                color: getOnBrightLinkTextColor(props.theme)
            })));

        case ERROR:
            return css(["", ";font-weight:bold;"], getDefaultLinkStyles(Object.assign({}, props, {
                color: getErrorTextColor(props.theme)
            })));

        case DEFAULT:
        default:
            return getDefaultLinkStyles(Object.assign({}, props, {
                color: getLinkTextColor(props.theme)
            }));
    }
};
const StyledATag = styled.a.withConfig({
    displayName: "VizExLink__StyledATag",
    componentId: "hw9lnu-0"
})(["", ""], getLinkStyles);

const VizExLink = props => {
    const {
        use,
        href,
        onClick,
        children,
        theme
    } = props,
    rest = _objectWithoutPropertiesLoose(props, ["use", "href", "onClick", "children", "theme"]);

    return /*#__PURE__*/ _jsx(StyledATag, Object.assign({}, rest, {
        use: use,
        onClick: onClick,
        href: href,
        theme: theme,
        children: children
    }));
};

VizExLink.displayName = 'VizExLink';
VizExLink.propTypes = {
    children: PropTypes.node,
    external: PropTypes.bool,
    href: PropTypes.string,
    onClick: PropTypes.func,
    theme: themePropType,
    use: PropTypes.oneOf([ON_BRIGHT, DEFAULT, ERROR])
};
VizExLink.defaultProps = {
    use: DEFAULT
};
export default VizExLink;