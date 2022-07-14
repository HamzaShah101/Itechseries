'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    TYPICAL_RESPONSE_TIME
} from '../constants/messageTypes';
export const isTypicalResponseTimeMessage = message => getTopLevelType(message) === TYPICAL_RESPONSE_TIME;