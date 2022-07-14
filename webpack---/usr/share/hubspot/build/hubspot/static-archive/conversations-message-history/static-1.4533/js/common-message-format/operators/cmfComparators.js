'use es6';

import get from 'transmute/get';
import {
    LIVE_CHAT,
    FB_MESSENGER
} from 'conversations-internal-schema/constants/ThreadSources';
import {
    CRM,
    EMAIL
} from '../constants/contentTypes';
import {
    VISITOR_SENDER
} from '../constants/cmfSenderTypes';
import {
    COMMON_MESSAGE
} from '../constants/messageTypes';
import {
    getStatusSource,
    getSenderTypeForCMF
} from './commonMessageFormatGetters';
import {
    FB_MESSENGER_GENERIC_CHANNEL_ID
} from '../constants/genericChannelIds';
import {
    getGenericChannelId
} from '../operators/commonMessageGetters';
export const isCommonMessageFormat = message => {
    return get('@type', message) === COMMON_MESSAGE;
};
export const isCrmMessage = message => {
    return isCommonMessageFormat(message) && getStatusSource(message) === CRM;
};
export const isEmailCMF = message => {
    return isCommonMessageFormat(message) && getStatusSource(message) === EMAIL;
};
export const isChatMessage = message => {
    return isCommonMessageFormat(message) && !isEmailCMF(message);
};
export const isLiveChatPlainText = message => {
    return isCommonMessageFormat(message) && getSenderTypeForCMF(message) === VISITOR_SENDER && getStatusSource(message) === LIVE_CHAT;
};
export const isForwardableCMF = message => {
    return isCommonMessageFormat(message) && (isEmailCMF(message) || isCrmMessage(message));
};
export const isFacebookChannel = message => isCommonMessageFormat(message) && getGenericChannelId(message) === FB_MESSENGER_GENERIC_CHANNEL_ID || getStatusSource(message) === FB_MESSENGER;