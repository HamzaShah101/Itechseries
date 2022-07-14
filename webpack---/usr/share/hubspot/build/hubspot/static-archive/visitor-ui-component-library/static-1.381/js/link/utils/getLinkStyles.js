'use es6';

import {
    css
} from 'styled-components';
import {
    adjustLuminance
} from '../../utils/adjustLuminance';
import {
    getLinkTextColor
} from '../theme/linkThemeOperators';
export const getLinkHoverStyles = color => css(["color:", ";text-decoration:underline;"], adjustLuminance(color, -30));
export const getLinkActiveStyles = color => css(["color:", ";"], adjustLuminance(color, 30));
export const getLinkStyles = ({
    color,
    active,
    hover
}) => css(["cursor:pointer;text-decoration:none;transition:all.15s ease-out;color:", ";font-weight:400;", ";", ";:hover{", ";}:active{", ";}:focus{outline:0;}"], color, active ? getLinkActiveStyles(color) : null, hover ? getLinkHoverStyles(color) : null, getLinkHoverStyles(color), getLinkActiveStyles(color));
export const getGlobalLinkStyles = css(["a{", ";}"], ({
    theme
}) => getLinkStyles({
    color: getLinkTextColor(theme)
}));