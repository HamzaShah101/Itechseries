'use es6';

import {
    createAction
} from 'flux-actions';
import {
    SET_THREADS_SUCCESS
} from '../constants/actionTypes';
export const setThreadsSuccess = createAction(SET_THREADS_SUCCESS);