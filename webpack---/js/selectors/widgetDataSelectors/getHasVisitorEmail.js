'use es6';

import get from 'transmute/get';
import {
    createSelector
} from 'reselect';
const getEmailCaptureStatus = get('emailCapture');
export const getHasVisitorEmail = createSelector(getEmailCaptureStatus, get('hasVisitorEmail'));