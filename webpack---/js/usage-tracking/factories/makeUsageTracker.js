'use es6';

import {
    makeInAppUsageTracker
} from './makeInAppUsageTracker';
import {
    makePublicUsageTracker
} from './makePublicUsageTracker';
export function makeUsageTracker({
    messagesUtk,
    inApp53 = false
}) {
    return inApp53 ? makeInAppUsageTracker({
        messagesUtk
    }) : makePublicUsageTracker({
        messagesUtk
    });
}