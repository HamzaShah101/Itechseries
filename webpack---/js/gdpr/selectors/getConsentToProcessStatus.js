'use es6';

import get from 'transmute/get';
import {
    createSelector
} from 'reselect';
const getGdpr = get('gdpr');
export const getConsentToProcessStatus = createSelector([getGdpr], get('consentToProcessStatus'));