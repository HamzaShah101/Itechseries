'use es6';

import PortalIdParser from 'PortalIdParser';
import {
    createTracker
} from 'usage-tracker-public';
import events from 'conversations-visitor-ui/events.yaml'; // eslint-disable-line

export const makeInAppUsageTracker = () => createTracker({
    events,
    isExternalHost: false,
    properties: {
        namespace: 'conversations-visitor-ui',
        hubId: PortalIdParser.get(),
        isIncludedInPageViewSample: false
    }
});