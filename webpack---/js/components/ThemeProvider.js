'use es6';

import {
    jsx as _jsx
} from "react/jsx-runtime";
import PropTypes from 'prop-types';
import {
    getColoring
} from '../selectors/widgetDataSelectors/getColoring';
import {
    getAccentColor,
    getUseDefaultColor
} from 'conversations-internal-schema/coloring/operators/coloringGetters';
import {
    useSelector
} from 'react-redux';
import {
    createTheme
} from 'visitor-ui-component-library/theme/createTheme';
import {
    setPrimaryColor
} from 'visitor-ui-component-library/theme/defaultThemeOperators';
import {
    DEFAULT_HELP_TEXT_COLOR
} from 'visitor-ui-component-library/theme/ColorConstants';
import {
    setTransparentOnBackgroundIconButton
} from 'visitor-ui-component-library/button/theme/iconButtonThemeOperators';
import {
    CALYPSO
} from 'HubStyleTokens/colors';
import VizExThemeProvider from 'visitor-ui-component-library/theme/VizExThemeProvider';

const ThemeProvider = ({
    children
}) => {
    const coloring = useSelector(getColoring);
    const primaryColor = getAccentColor(coloring);
    const useDefaultColor = getUseDefaultColor(coloring);
    const operators = [];

    if (useDefaultColor) {
        operators.push(setPrimaryColor(CALYPSO));
        operators.push(setTransparentOnBackgroundIconButton(DEFAULT_HELP_TEXT_COLOR));
    } else if (primaryColor) {
        operators.push(setPrimaryColor(primaryColor));
    }

    return /*#__PURE__*/ _jsx(VizExThemeProvider, {
        theme: createTheme(...operators),
        children: children
    });
};

ThemeProvider.displayName = 'ThemeProvider';
ThemeProvider.propTypes = {
    children: PropTypes.node
};
export default ThemeProvider;