'use es6';

import getIn from 'transmute/getIn';
import {
    ASSIGNEE,
    CHANNEL_DETAILS,
    LATEST_MESSAGE_TIMESTAMP,
    LATEST_READ_TIMESTAMP,
    PREVIEW_MESSAGE_ID,
    RESPONDER,
    STATUS,
    THREAD_ID,
    UNSEEN_COUNT
} from '../constants/KeyPaths';
import pipe from 'transmute/pipe';
import {
    getChannelName as getChannelDetailsName
} from '../../channel-details/operators/channelDetailsGetters';
export const getLatestReadTimestamp = getIn(LATEST_READ_TIMESTAMP);
export const getThreadId = getIn(THREAD_ID);
export const getAssignedAgentId = getIn(ASSIGNEE);
export const getStatus = getIn(STATUS);
export const getChannelDetails = getIn(CHANNEL_DETAILS);
export const getResponder = getIn(RESPONDER);
export const getUnseenCount = getIn(UNSEEN_COUNT);
export const getLatestMessageTimestamp = getIn(LATEST_MESSAGE_TIMESTAMP);
export const getPreviewMessageId = getIn(PREVIEW_MESSAGE_ID);
export const getChannelName = pipe(getChannelDetails, getChannelDetailsName);