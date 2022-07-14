'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    READ_THREAD
} from '../constants/messageTypes';
export const isReadThreadMessage = message => getTopLevelType(message) === READ_THREAD;