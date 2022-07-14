'use es6';

import {
    Map as ImmutableMap
} from 'immutable';
import get from 'transmute/get';
import setIn from 'transmute/setIn';
import {
    GET_VISITOR_THREADS_SUCCESS,
    UPDATE_MESSAGE_EDITOR_STAGING_TEXT,
    REMOVE_MESSAGE_EDITOR_STAGING_TEXT
} from '../../constants/VisitorActionTypes';
import {
    getThreadId
} from '../../threads/operators/threadGetters';
import {
    handleActions
} from 'flux-actions';
const initialState = ImmutableMap();
export const STAGING_TEXT = 'stagingText';
export default handleActions({
    [GET_VISITOR_THREADS_SUCCESS]: (state, action) => {
        const {
            threads
        } = action.payload;
        const indexedDefaultStagingThreads = !threads || !threads.length ? ImmutableMap() : threads.reduce((newThreadsMap, newThread) => {
            const threadId = getThreadId(newThread);
            return newThreadsMap.set(threadId, {
                stagingText: ''
            });
        }, ImmutableMap());
        return indexedDefaultStagingThreads;
    },
    [UPDATE_MESSAGE_EDITOR_STAGING_TEXT]: (state, action) => {
        const {
            threadId,
            stagingText
        } = action.payload;
        const existingThread = get(threadId, state);

        if (existingThread) {
            const newStagingState = setIn([threadId, STAGING_TEXT], stagingText, state);
            return newStagingState;
        }

        return state.set(threadId, {
            stagingText
        });
    },
    [REMOVE_MESSAGE_EDITOR_STAGING_TEXT]: (state, action) => {
        const currentThreadId = action.payload;
        const existingThread = get(currentThreadId, state);

        if (existingThread) {
            const newStagingState = setIn([currentThreadId, STAGING_TEXT], '', state);
            return newStagingState;
        }

        return state;
    }
}, initialState);