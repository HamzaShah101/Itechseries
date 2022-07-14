'use es6';

import {
    createAction
} from 'flux-actions';
import {
    ADD_AVAILABILITY_MESSAGE_TIMEOUT
} from '../constants/actionTypes';
const addAvailabilityMessageTimeout = createAction(ADD_AVAILABILITY_MESSAGE_TIMEOUT, (channel, timeout) => ({
    channel,
    timeout
}));
export {
    addAvailabilityMessageTimeout as
    default, addAvailabilityMessageTimeout
};