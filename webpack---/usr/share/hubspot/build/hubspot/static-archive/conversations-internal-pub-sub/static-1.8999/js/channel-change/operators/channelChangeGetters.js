'use es6';

import getIn from 'transmute/getIn';
import {
    ID,
    TIMESTAMP,
    TYPE,
    NEW_CHANNEL,
    NEW_CHANNEL_NAME,
    OLD_CHANNEL_NAME,
    OLD_CHANNEL
} from '../constants/keyPaths';
export const getId = getIn(ID);
export const getTimestamp = getIn(TIMESTAMP);
export const getType = getIn(TYPE);
export const getNewChannelName = getIn(NEW_CHANNEL_NAME);
export const getNewChannelDescriptor = getIn(NEW_CHANNEL);
export const getOldChannelName = getIn(OLD_CHANNEL_NAME);
export const getOldChannelDescriptor = getIn(OLD_CHANNEL);