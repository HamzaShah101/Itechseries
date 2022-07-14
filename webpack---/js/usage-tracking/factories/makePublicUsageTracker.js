'use es6';

import PortalIdParser from 'PortalIdParser';
import {
    createTracker
} from 'usage-tracker-public';
import events from 'conversations-visitor-ui/events.yaml'; // eslint-disable-line

import {
    PAGEVIEW_SAMPLE_PERCENT
} from '../constants/pageViewSamplePercent';

function makeProperties({
    messagesUtk
}) {
    return {
        namespace: 'conversations-visitor-ui',
        hubId: PortalIdParser.get(),
        // HACK!!! internally, usage-tracker splits the hstc on "." and takes the second item
        hstc: `.${messagesUtk}`,
        email: null,
        lang: null,
        isIncludedInPageViewSample: Math.random() < PAGEVIEW_SAMPLE_PERCENT
    };
}

export const makePublicUsageTracker = ({
    messagesUtk,
    portalId
}) => createTracker({
    events,
    properties: makeProperties({
        messagesUtk,
        portalId
    })
});