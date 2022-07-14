'use es6';

import {
    Record
} from 'immutable';
import Message from '../../message/records/Message';
import ColoringRecord from '../../coloring/records/ColoringRecord';
import TypicalResponseTime from '../../typical-response-time/records/TypicalResponseTime';
import WidgetAvailabilityOptions from '../../availability/records/WidgetAvailabilityOptions';
import GDPRConsentOptions from './GDPRConsentOptions';
import {
    V1,
    RIGHT_ALIGNED
} from '../constants/widgetDataTypes';
const TYPE = '@type';
export default Record({
    [TYPE]: V1,
    botResponder: null,
    chatflowId: null,
    coloring: ColoringRecord(),
    channelInstanceId: null,
    gates: null,
    gdprConsentOptions: GDPRConsentOptions(),
    inOfficeHours: false,
    knowledgeBaseUrl: null,
    language: null,
    meetingsLinkText: null,
    meetingsLinkUrl: null,
    message: Message(),
    messagesPageUri: null,
    nextOfficeHoursStartTime: 0,
    privateLoad: false,
    sendFrom: null,
    sessionId: null,
    showingHsBranding: false,
    shouldListenToGdprBannerConsent: true,
    typicalResponseTime: TypicalResponseTime(),
    usingOfficeHours: false,
    availabilityOptions: new WidgetAvailabilityOptions(),
    showPreviousConversations: true,
    widgetLocation: RIGHT_ALIGNED
}, 'WidgetData');