'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    EMAIL_CAPTURE_RESPONSE
} from '../constants/messageTypes';
export const isEmailCaptureResponseMessage = message => getTopLevelType(message) === EMAIL_CAPTURE_RESPONSE;