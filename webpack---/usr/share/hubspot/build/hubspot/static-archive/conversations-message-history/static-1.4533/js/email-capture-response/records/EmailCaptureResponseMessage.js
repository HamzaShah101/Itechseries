'use es6';

import {
    Record,
    Map as ImmutableMap,
    fromJS,
    List
} from 'immutable';
import Status from '../../common-message-format/records/Status';
import {
    buildStatus
} from '../../common-message-format/operators/buildStatus';
import {
    EMAIL_CAPTURE_RESPONSE
} from '../constants/messageTypes';
import {
    NOT_DELETED
} from '../../common-message-format/constants/messageDeleteStatus';
import {
    generateUniqueClientTimestamp
} from '../../util/timestamps';
import {
    generateUuid
} from '../../util/generateUuid';

class EmailCaptureResponseMessage extends Record({
    '@type': EMAIL_CAPTURE_RESPONSE,
    id: null,
    text: '',
    timestamp: null,
    sender: ImmutableMap(),
    status: Status(),
    messageDeletedStatus: NOT_DELETED,
    direction: '',
    channelInstanceId: null,
    genericChannelId: null,
    senders: List(),
    recipients: List()
}, 'EmailCaptureResponseMessage') {
    constructor(props = {}) {
        const map = fromJS(Object.assign({}, props, {
            id: props.id || generateUuid(),
            status: buildStatus(props.status),
            timestamp: props.timestamp || generateUniqueClientTimestamp('EmailCaptureResponseMessage-timestamp')
        })).filterNot(value => typeof value === 'undefined');
        super(map);
    }

}

export default EmailCaptureResponseMessage;