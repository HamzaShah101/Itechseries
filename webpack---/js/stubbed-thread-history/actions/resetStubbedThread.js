'use es6';

import {
    createAction
} from 'flux-actions';
import {
    RESET_STUBBED_THREAD
} from '../constants/StubbedThreadHistoryActionTypes';
export const resetStubbedThread = createAction(RESET_STUBBED_THREAD);