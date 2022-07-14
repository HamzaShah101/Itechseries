'use es6';

import {
    IFRAME_RESIZE
} from '../constants/PostMessageTypes';
import {
    postMessageToParent
} from './postMessageToParent';
export const handleIframeResize = data => postMessageToParent(IFRAME_RESIZE, data);