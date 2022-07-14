'use es6';

import {
    createSelector
} from 'reselect';
import {
    getVisitorIdentity
} from './getVisitorIdentity';
import {
    getGlobalCookieOptOut as getGlobalCookieOptOutOperator
} from '../operators/getGlobalCookieOptOut';
export const OPT_OUT_YES = 'yes';
export const OPT_OUT_NO = 'no';
export const getGlobalCookieOptOut = createSelector(getVisitorIdentity, visitorIdentity => {
    return getGlobalCookieOptOutOperator(visitorIdentity);
});