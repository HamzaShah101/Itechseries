'use es6';

import Status from '../../common-message-format/records/Status';
import {
    List,
    Map as ImmutableMap,
    Record
} from 'immutable';
import {
    NOT_DELETED
} from '../../common-message-format/constants/messageDeleteStatus';
import {
    THREAD_COMMENT
} from '../constants/messageTypes';
const CommentMessage = Record({
    '@type': THREAD_COMMENT,
    sender: ImmutableMap(),
    senders: List(),
    timestamp: null,
    text: '',
    richText: '',
    hasMore: false,
    id: null,
    status: Status(),
    attachments: List(),
    messageDeletedStatus: NOT_DELETED,
    clientType: null,
    genericChannelId: 1005
}, 'CommentMessage');
export default CommentMessage;