'use es6';

import getIn from 'transmute/getIn';
import {
    ADDRESS,
    VISITOR_ID
} from '../constants/commonReplyMetadaKeypaths';
export const getAddressFromEmailAddressRecord = getIn(ADDRESS);
export const getVisitorId = getIn(VISITOR_ID);