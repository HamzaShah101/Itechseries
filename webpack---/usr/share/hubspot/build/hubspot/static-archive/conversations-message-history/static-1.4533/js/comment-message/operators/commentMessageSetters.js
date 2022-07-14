'use es6';

import setIn from 'transmute/setIn';
import {
    ATTACHMENTS,
    ID,
    STATUS,
    TIMESTAMP
} from '../constants/keyPaths';
export const setId = setIn(ID);
export const setStatus = setIn(STATUS);
export const setAttachments = setIn(ATTACHMENTS);
export const setTimestamp = setIn(TIMESTAMP);