'use es6';

import {
    eventProps
} from '../selectors/eventProps';
import {
    getIsPrivateLoad
} from '../../widget-data/selectors/getIsPrivateLoad';
import {
    getUsageTracker
} from '../usageTracker';
import {
    getIsUserTrackingAllowed
} from '../../gdpr/selectors/getIsUserTrackingAllowed';
export function trackInteraction(eventName, properties = {}) {
    return (_dispatch, getState) => {
        const tracker = getUsageTracker();
        const isPrivateLoad = getIsPrivateLoad(getState());
        const isUserTrackingAllowed = getIsUserTrackingAllowed(getState());

        if (isUserTrackingAllowed) {
            tracker.track(eventName, Object.assign({}, properties, {}, eventProps(getState()), {
                privateLoad: isPrivateLoad
            }));
        }
    };
}