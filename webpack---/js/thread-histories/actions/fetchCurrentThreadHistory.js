'use es6';

import {
    getSelectedThreadId
} from '../../selected-thread/selectors/getSelectedThreadId';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
import {
    STUBBED_THREAD_ID
} from '../../threads/constants/stubbedThreadId';
import {
    fetchThreadHistory
} from './fetchThreadHistory';
export const fetchCurrentThreadHistory = () => (dispatch, getState) => {
    const sessionId = getSessionId(getState());
    const threadId = getSelectedThreadId(getState());

    if (threadId === null || threadId === STUBBED_THREAD_ID) {
        return;
    }

    dispatch(fetchThreadHistory({
        threadId,
        sessionId
    }));
};