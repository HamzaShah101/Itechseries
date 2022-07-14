'use es6';

import {
    REQUEST_WIDGET
} from '../constants/PostMessageTypes';
import {
    postMessageToParent
} from './postMessageToParent';
export const handleRequestWidget = data => postMessageToParent(REQUEST_WIDGET, data);