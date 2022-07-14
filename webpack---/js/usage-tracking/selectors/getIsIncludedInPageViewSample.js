'use es6';

import getIn from 'transmute/getIn';
import {
    getUsageTracker
} from '../usageTracker';
export const getIsIncludedInPageViewSample = () => {
    return getIn(['config', 'properties', 'isIncludedInPageViewSample'], getUsageTracker());
};