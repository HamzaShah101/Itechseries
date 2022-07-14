'use es6';

import {
    createAction
} from 'flux-actions';
import {
    SELECT_THREAD
} from '../constants/selectedThreadActionTypes';
export const selectThread = createAction(SELECT_THREAD, threadId => ({
    threadId
}));