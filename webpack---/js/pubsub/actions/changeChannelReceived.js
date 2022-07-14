'use es6';

import {
    createAction
} from 'flux-actions';
import {
    CHANNEL_CHANGE_RECEIVED
} from '../constants/pubsubActionTypes';
export const channelChangeReceived = createAction(CHANNEL_CHANGE_RECEIVED, ({
    channelChange,
    threadId
}) => ({
    channelChange,
    threadId
}));