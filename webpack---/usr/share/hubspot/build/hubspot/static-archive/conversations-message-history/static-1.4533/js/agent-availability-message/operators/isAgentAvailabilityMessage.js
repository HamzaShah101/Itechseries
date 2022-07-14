'use es6';

import {
    getTopLevelType
} from '../../common-message-format/operators/commonMessageFormatGetters';
import {
    AWAY_MODE_CHANGE
} from '../constants/messageTypes';
export const isAgentAvailabilityMessage = message => getTopLevelType(message) === AWAY_MODE_CHANGE;