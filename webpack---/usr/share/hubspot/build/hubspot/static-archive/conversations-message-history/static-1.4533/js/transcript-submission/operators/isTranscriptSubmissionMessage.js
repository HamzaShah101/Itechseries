'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    CHAT_TRANSCRIPT_SENT
} from '../constants/messageTypes';
export const isTranscriptSubmissionMessage = message => getTopLevelType(message) === CHAT_TRANSCRIPT_SENT;