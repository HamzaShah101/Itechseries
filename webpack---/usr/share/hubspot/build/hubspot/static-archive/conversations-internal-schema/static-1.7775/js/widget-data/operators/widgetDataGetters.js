'use es6';

import getIn from 'transmute/getIn';
import get from 'transmute/get';
export const getBotResponder = getIn(['sendFrom', '0']);
export const getChatHeadingConfig = getIn(['message', 'chatHeadingConfig']);
export const getColoring = get('coloring');
export const getConsentToCommunicateMessage = getIn(['message', 'customConsentToCommunicateMessage']);
export const getConsentToProcessMessage = getIn(['message', 'customConsentToProcessMessage']);
export const getGDPRConsentToProcessStatus = getIn(['gdprConsentOptions', 'consentToProcessStatus']);
export const getMessage = get('message');
export const getSendFrom = getIn(['sendFrom']);
export const getSessionId = get('sessionId');
export const getShowPreviousConversations = get('showPreviousConversations');
export const getTypicalResponseTime = get('typicalResponseTime');