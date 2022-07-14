'use es6';

import {
    Map as ImmutableMap
} from 'immutable';
import {
    handleActions
} from 'flux-actions';
import * as ActionTypes from '../constants/VisitorActionTypes';
import {
    CREATE_NEW_THREAD
} from '../thread-create/constants/actionTypes';
import {
    FETCH_THREAD_HISTORY
} from '../thread-histories/constants/ActionTypes';
const initialState = ImmutableMap({
    hasVisitorEmail: false
});
const emailCaptureReducer = handleActions({
    [CREATE_NEW_THREAD.SUCCEEDED](state, action) {
        const {
            shouldAskForEmail
        } = action.payload;
        return state.set('hasVisitorEmail', !shouldAskForEmail);
    },

    [FETCH_THREAD_HISTORY.SUCCEEDED](state, action) {
        const {
            data: {
                hasVisitorEmail
            }
        } = action.payload;
        return state.set('hasVisitorEmail', hasVisitorEmail);
    },

    [ActionTypes.SEND_VISITOR_EMAIL_ADDRESS_SUCCEEDED](state) {
        return state.set('hasVisitorEmail', true);
    }

}, initialState);
export default emailCaptureReducer;