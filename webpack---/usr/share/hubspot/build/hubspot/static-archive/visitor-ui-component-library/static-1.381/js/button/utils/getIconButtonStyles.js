'use es6'; //eslint-disable no-case-declarations

import {
    PRIMARY,
    TRANSPARENT_ON_PRIMARY,
    TRANSPARENT_ON_BACKGROUND
} from '../constants/IconButtonUses';
import {
    adjustLuminance
} from '../../utils/adjustLuminance';
import {
    css
} from 'styled-components';
import {
    hexToRGB
} from '../../utils/hexToRGB';
import {
    getTransparentOnBackgroundIconButtonBackgroundColor,
    getTransparentOnPrimaryIconButtonBackgroundColor,
    getIconButtonBackgroundColor,
    getDisabledIconButtonBackgroundColor,
    getDisabledIconButtonTextColor,
    getTransparentOnBackgroundIconButtonTextColor,
    getTransparentOnPrimaryIconButtonTextColor,
    getIconButtonTextColor
} from '../theme/iconButtonThemeOperators';
export const getHoverBackgroundStyles = ({
    theme,
    use
}) => {
    switch (use) {
        case TRANSPARENT_ON_BACKGROUND:
            {
                const buttonBackgroundColor = getTransparentOnBackgroundIconButtonBackgroundColor(theme);
                const {
                    r,
                    g,
                    b
                } = hexToRGB(buttonBackgroundColor);
                return css(["background-color:rgba(", ",", ",", ",0.1);"], r, g, b);
            }

        case TRANSPARENT_ON_PRIMARY:
            {
                const buttonBackgroundColor = getTransparentOnPrimaryIconButtonBackgroundColor(theme);
                const {
                    r,
                    g,
                    b
                } = hexToRGB(buttonBackgroundColor);
                return css(["background-color:rgba(", ",", ",", ",0.1);"], r, g, b);
            }

        case PRIMARY:
        default:
            {
                const buttonBackgroundColor = getIconButtonBackgroundColor(theme);
                return css(["background-color:", ";"], adjustLuminance(buttonBackgroundColor, 20));
            }
    }
};
export const getActiveBackgroundStyles = ({
    theme,
    use
}) => {
    switch (use) {
        case TRANSPARENT_ON_BACKGROUND:
            {
                const buttonBackgroundColor = getTransparentOnBackgroundIconButtonBackgroundColor(theme);
                const {
                    r,
                    g,
                    b
                } = hexToRGB(buttonBackgroundColor);
                return css(["background-color:rgba(", ",", ",", ",0.4);"], r, g, b);
            }

        case TRANSPARENT_ON_PRIMARY:
            {
                const buttonBackgroundColor = getTransparentOnPrimaryIconButtonBackgroundColor(theme);
                const {
                    r,
                    g,
                    b
                } = hexToRGB(buttonBackgroundColor);
                return css(["background-color:rgba(", ",", ",", ",0.4);"], r, g, b);
            }

        case PRIMARY:
        default:
            {
                const buttonBackgroundColor = getIconButtonBackgroundColor(theme);
                return css(["background-color:", ";"], adjustLuminance(buttonBackgroundColor, -10));
            }
    }
};

const getDisabledBackgroundStyles = ({
    theme,
    use
}) => {
    switch (use) {
        case TRANSPARENT_ON_BACKGROUND:
        case TRANSPARENT_ON_PRIMARY:
            {
                return css(["background-color:transparent;border:none;"]);
            }

        case PRIMARY:
        default:
            {
                return css(["background-color:", ";border:none;"], getDisabledIconButtonBackgroundColor(theme));
            }
    }
};

export const getBackgroundStyles = ({
    theme,
    use,
    active,
    hover,
    disabled
}) => {
    if (disabled) {
        return getDisabledBackgroundStyles({
            theme,
            use
        });
    }

    let stateBackgroundStyles;

    if (active) {
        stateBackgroundStyles = getActiveBackgroundStyles({
            theme,
            use
        });
    }

    if (hover) {
        stateBackgroundStyles = getHoverBackgroundStyles({
            theme,
            use
        });
    }

    switch (use) {
        case TRANSPARENT_ON_BACKGROUND:
        case TRANSPARENT_ON_PRIMARY:
            {
                return css(["border:none;background-color:transparent;", ""], stateBackgroundStyles);
            }

        case PRIMARY:
        default:
            {
                return css(["background-color:", ";border:none;", ""], getIconButtonBackgroundColor(theme), stateBackgroundStyles);
            }
    }
};
export const getColorStyles = ({
    theme,
    use,
    disabled
}) => {
    if (disabled) {
        return css(["color:", ";"], getDisabledIconButtonTextColor(theme));
    }

    switch (use) {
        case TRANSPARENT_ON_BACKGROUND:
            {
                return css(["color:", ";"], getTransparentOnBackgroundIconButtonTextColor(theme));
            }

        case TRANSPARENT_ON_PRIMARY:
            {
                return css(["color:", ";"], getTransparentOnPrimaryIconButtonTextColor(theme));
            }

        case PRIMARY:
        default:
            {
                return css(["color:", ";"], getIconButtonTextColor(theme));
            }
    }
};