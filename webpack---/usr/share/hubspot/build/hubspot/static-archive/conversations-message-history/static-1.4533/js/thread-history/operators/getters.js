'use es6';

import getIn from 'transmute/getIn';
import {
    MESSAGE_RESULTS,
    VISITOR_LAST_READ_AT_TIMESTAMP,
    NUM_SOFT_DELETED_MESSAGES,
    MESSAGES,
    MESSAGE_OFFSET,
    OFFSET_TIMESTAMP,
    OFFSET_ORDINAL,
    MESSAGE_HAS_MORE,
    ATTACHMENTS,
    FILE_ATTACHMENTS
} from '../constants/keyPaths';
export const getMessagesBase = getIn(MESSAGES);
export const getHasMore = getIn(MESSAGE_HAS_MORE);
export const getOffset = getIn(MESSAGE_OFFSET);
export const getOffsetTimestamp = getIn(OFFSET_TIMESTAMP);
export const getOffsetOrdinal = getIn(OFFSET_ORDINAL);
export const getMessages = getIn(MESSAGE_RESULTS);
export const getVisitorLastReadAtTimestamp = getIn(VISITOR_LAST_READ_AT_TIMESTAMP);
export const getNumSoftDeletedMessages = getIn(NUM_SOFT_DELETED_MESSAGES);
export const getAttachments = getIn(ATTACHMENTS);
export const getFileAttachments = getIn(FILE_ATTACHMENTS);