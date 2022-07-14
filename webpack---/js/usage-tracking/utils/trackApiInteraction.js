'use es6';

import {
    API_TRACKING_EVENT_NAMES
} from '../../constants/apiTrackingEventNames';
import once from 'transmute/once';

const track = (eventName, properties) => {
    if (window.newrelic && window.newrelic.addPageAction) {
        window.newrelic.addPageAction(eventName, properties);
    }
};

const trackOnReady = once(track);
const trackSettings = once(track);
const trackLoadMethod = once(track);
const trackRefreshMethod = once(track);
const trackOpenMethod = once(track);
const trackCloseMethod = once(track);
const trackRemoveMethod = once(track);
const trackStatusMethod = once(track);
const trackClearMethod = once(track);
const trackConversationStartedEvent = once(track);
const trackConversationClosedEvent = once(track);
const trackUnreadConversationCountChangedEvent = once(track);
export const trackApiInteraction = (eventName, properties) => {
    if (!eventName || !properties || !API_TRACKING_EVENT_NAMES.includes(eventName)) {
        return;
    }

    if (eventName === 'HubspotConversations-hsConversationsOnReady-used') {
        trackOnReady(eventName, properties);
    } else if (eventName === 'HubspotConversations-hsConversationsSettings-used') {
        trackSettings(eventName, properties);
    } else if (eventName === 'HubspotConversations-api-method-used') {
        switch (properties.method) {
            case 'load':
                trackLoadMethod(eventName, properties);
                break;

            case 'refresh':
                trackRefreshMethod(eventName, properties);
                break;

            case 'open':
                trackOpenMethod(eventName, properties);
                break;

            case 'close':
                trackCloseMethod(eventName, properties);
                break;

            case 'remove':
                trackRemoveMethod(eventName, properties);
                break;

            case 'status':
                trackStatusMethod(eventName, properties);
                break;

            case 'clear':
                trackClearMethod(eventName, properties);
                break;

            default:
        }
    } else if (eventName === 'HubspotConversations-api-event-listener-registered') {
        switch (properties.event) {
            case 'conversationStarted':
                trackConversationStartedEvent(eventName, properties);
                break;

            case 'conversationClosed':
                trackConversationClosedEvent(eventName, properties);
                break;

            case 'unreadConversationCountChanged':
                trackUnreadConversationCountChangedEvent(eventName, properties);
                break;

            default:
        }
    }
};