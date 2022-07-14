'use es6';

import {
    createAction
} from 'flux-actions';
import {
    ADD_TIME_ON_PAGE_TRIGGER
} from '../constants/timeOnPageTriggerActionTypes';
export const addTimeOnPageTriggerAction = createAction(ADD_TIME_ON_PAGE_TRIGGER, timeoutId => ({
    timeoutId
}));