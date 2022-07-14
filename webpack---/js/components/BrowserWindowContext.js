'use es6';

import {
    createContext
} from 'react';
export const defaultBrowserWindowContext = {
    browserWindowHeight: 1080,
    browserWindowWidth: 1920
};
export const BrowserWindowContext = /*#__PURE__*/ createContext(defaultBrowserWindowContext);