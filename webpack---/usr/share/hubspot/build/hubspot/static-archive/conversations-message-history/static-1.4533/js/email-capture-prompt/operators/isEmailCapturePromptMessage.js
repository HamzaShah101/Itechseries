'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    EMAIL_CAPTURE_PROMPT
} from '../constants/messageTypes';
export const isEmailCapturePromptMessage = message => getTopLevelType(message) === EMAIL_CAPTURE_PROMPT;