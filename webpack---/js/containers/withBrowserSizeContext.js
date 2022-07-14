'use es6';
/* eslint-disable react/display-name */

import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    BrowserWindowContext
} from '../components/BrowserWindowContext';
export const withBrowserSizeContext = Component => {
    return props => {
        return /*#__PURE__*/ _jsx(BrowserWindowContext.Consumer, {
            children: ({
                browserWindowHeight,
                browserWindowWidth
            }) => {
                return /*#__PURE__*/ _jsx(Component, Object.assign({}, props, {
                    browserWindowHeight: browserWindowHeight,
                    browserWindowWidth: browserWindowWidth
                }));
            }
        });
    };
};