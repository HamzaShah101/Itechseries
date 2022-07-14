'use es6';

import getIn from 'transmute/getIn';
import {
    CAPTURE_VISITOR_EMAIL_ADDRESS,
    CLIENT_TRIGGERS,
    CONSENT_TO_COMMUNICATE_SUBSCRIPTION_ID,
    CUSTOM_CONSENT_TO_COMMUNICATE_MESSAGE,
    CUSTOM_CONSENT_TO_PROCESS_MESSAGE,
    CUSTOM_EMAIL_CAPTURE_DELAY,
    GDPR_CONSENT_TO_COMMUNICATE_ENABLED,
    GDPR_CONSENT_TO_PROCESS_ENABLED,
    GDPR_EXPLICIT_CONSENT_REQUIRED,
    GDPR_COOKIE_CONSENT_PROMPT,
    ID,
    INBOX_ID,
    LANGUAGE,
    POP_MESSAGE_ON_SMALL_SCREENS,
    POP_OPEN_WELCOME_MESSAGE,
    POP_OPEN_WIDGET,
    ROUTING_RULES,
    SEND_FROM_ROUTING_RULES,
    TYPE
} from '../constants/keyPaths';
export const getCaptureVisitorEmailAddress = getIn(CAPTURE_VISITOR_EMAIL_ADDRESS);
export const getChatHeadingConfig = getIn(['chatHeadingConfig']);
export const getClientTriggers = getIn(CLIENT_TRIGGERS);
export const getConsentToCommunicateSubscriptionId = getIn(CONSENT_TO_COMMUNICATE_SUBSCRIPTION_ID);
export const getCustomConsentToCommunicateMessage = message => getIn(CUSTOM_CONSENT_TO_COMMUNICATE_MESSAGE, message) || '';
export const getCustomConsentToProcessMessage = message => getIn(CUSTOM_CONSENT_TO_PROCESS_MESSAGE, message) || '';
export const getCustomEmailCaptureDelay = getIn(CUSTOM_EMAIL_CAPTURE_DELAY);
export const getGdprConsentToCommunicateEnabled = getIn(GDPR_CONSENT_TO_COMMUNICATE_ENABLED);
export const getGdprConsentToProcessEnabled = getIn(GDPR_CONSENT_TO_PROCESS_ENABLED);
export const getGdprExplicitConsentRequired = getIn(GDPR_EXPLICIT_CONSENT_REQUIRED);
export const getGdprCookieConsentPrompt = getIn(GDPR_COOKIE_CONSENT_PROMPT);
export const getId = getIn(ID);
export const getInboxId = getIn(INBOX_ID);
export const getLanguage = getIn(LANGUAGE);
export const getPopMessageOnSmallScreens = getIn(POP_MESSAGE_ON_SMALL_SCREENS);
export const getPopOpenWelcomeMessage = getIn(POP_OPEN_WELCOME_MESSAGE);
export const getPopOpenWidget = getIn(POP_OPEN_WIDGET);
export const getRoutingRules = getIn(ROUTING_RULES);
export const getSendFromRoutingRules = getIn(SEND_FROM_ROUTING_RULES);
export const getType = getIn(TYPE);