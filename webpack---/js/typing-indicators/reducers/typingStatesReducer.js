'use es6';

import {
    Map as ImmutableMap
} from 'immutable';
import {
    handleActions
} from 'flux-actions';
import setIn from 'transmute/setIn';
import omit from 'transmute/omit';
import updateIn from 'transmute/updateIn';
import {
    ADD_TYPING_TIMEOUT_ID,
    REMOVE_TYPING_TIMEOUT_ID
} from '../constants/typingIndicatorActionTypes';
import {
    getTypingTimeoutIdForAgentInThread
} from '../operators/getTypingTimeoutIdForAgentInThread';
const initialState = ImmutableMap();
const typingStatesReducer = {
    [ADD_TYPING_TIMEOUT_ID]: (state, action) => {
        const {
            threadId,
            senderId,
            timeoutId
        } = action.payload;
        return setIn([`${threadId}`, `${senderId}`], timeoutId, state);
    },
    [REMOVE_TYPING_TIMEOUT_ID]: (state, action) => {
        const {
            threadId,
            senderId
        } = action.payload;

        if (getTypingTimeoutIdForAgentInThread({
                threadId: `${threadId}`,
                senderId: `${senderId}`,
                typingStates: state
            })) {
            return updateIn([`${threadId}`], omit([`${senderId}`]), state);
        }

        return state;
    }
};
export default handleActions(typingStatesReducer, initialState);