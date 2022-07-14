'use es6';

import {
    getPrimaryColor,
    getDisabledTextColor,
    getDisabledBackgroundColor,
    getTextOnPrimaryColor,
    setThemeProperty
} from '../../theme/defaultThemeOperators';
import {
    get
} from '../../utils/get';
export const getIconButtonBackgroundColor = getPrimaryColor;
export const getIconButtonTextColor = getTextOnPrimaryColor;
export const getTransparentOnPrimaryIconButtonBackgroundColor = getTextOnPrimaryColor;
export const getTransparentOnPrimaryIconButtonTextColor = getTextOnPrimaryColor;
export const getTransparentOnBackgroundIconButtonBackgroundColor = theme => get('transparentOnBackgroundIconButton', theme) || getPrimaryColor(theme);
export const getTransparentOnBackgroundIconButtonTextColor = theme => get('transparentOnBackgroundIconButton', theme) || getPrimaryColor(theme);
export const setTransparentOnBackgroundIconButton = setThemeProperty('transparentOnBackgroundIconButton');
export const getDisabledIconButtonTextColor = getDisabledTextColor;
export const getDisabledIconButtonBackgroundColor = getDisabledBackgroundColor;