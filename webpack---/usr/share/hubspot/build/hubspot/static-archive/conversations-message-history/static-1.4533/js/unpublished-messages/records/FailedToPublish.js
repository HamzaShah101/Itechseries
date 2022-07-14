'use es6';

import {
    Record
} from 'immutable';
import {
    MESSAGE_TYPE_ID,
    FAILED_TO_PUBLISH
} from '../constants/messageTypes';
const FailedToPublish = Record({
    [MESSAGE_TYPE_ID]: FAILED_TO_PUBLISH,
    threadId: null,
    channel: null,
    message: null,
    allowRetry: true
}, 'FailedToPublish');
export default FailedToPublish;