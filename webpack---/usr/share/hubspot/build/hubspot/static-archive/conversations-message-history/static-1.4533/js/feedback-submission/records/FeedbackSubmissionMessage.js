'use es6';

import {
    List,
    Map as ImmutableMap,
    Record
} from 'immutable';
import Status from '../../common-message-format/records/Status';
import {
    FEEDBACK_SUBMISSION
} from '../constants/messageTypes';
const FeedbackSubmissionMessage = Record({
    '@type': FEEDBACK_SUBMISSION,
    attachments: List(),
    feedbackTransactionId: null,
    id: null,
    messageDeletedStatus: null,
    recipients: List(),
    richText: null,
    sender: ImmutableMap(),
    senders: List(),
    status: Status(),
    text: null,
    threadId: null,
    timestamp: null,
    submissionId: null,
    direction: ''
}, 'FeedbackSubmissionMessage');
export default FeedbackSubmissionMessage;