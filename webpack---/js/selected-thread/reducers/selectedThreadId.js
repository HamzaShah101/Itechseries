'use es6';

import {
    handleActions,
    combineActions
} from 'flux-actions';
import {
    SELECT_THREAD,
    CLEAR_SELECTED_THREAD
} from '../constants/selectedThreadActionTypes';
import {
    CREATE_NEW_THREAD
} from '../../thread-create/constants/actionTypes';
const initialState = null;
export default handleActions({
    [combineActions(SELECT_THREAD, CREATE_NEW_THREAD.SUCCEEDED)](state, action) {
        const {
            threadId
        } = action.payload;
        return threadId;
    },

    [CLEAR_SELECTED_THREAD]() {
        return initialState;
    }

}, initialState);