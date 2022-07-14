'use es6';

import getIn from 'transmute/getIn';
import {
    ATTACHMENTS,
    CLIENT_TYPE,
    HAS_MORE,
    ID,
    MESSAGE_DELETED_STATUS,
    RICH_TEXT,
    SENDER,
    STATUS,
    TEXT,
    TIMESTAMP
} from '../constants/keyPaths';
export const getAttachments = getIn(ATTACHMENTS);
export const getClientType = getIn(CLIENT_TYPE);
export const getHasMore = getIn(HAS_MORE);
export const getId = getIn(ID);
export const getMessageDeletedStatus = getIn(MESSAGE_DELETED_STATUS);
export const getRichText = getIn(RICH_TEXT);
export const getSender = getIn(SENDER);
export const getStatus = getIn(STATUS);
export const getText = getIn(TEXT);
export const getTimestamp = getIn(TIMESTAMP);