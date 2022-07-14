'use es6';

import {
    selectThread
} from '../../selected-thread/actions/selectThread';
import {
    updateView
} from '../../current-view/actions/updateView';
import {
    THREAD_VIEW
} from '../../current-view/constants/views';
export function loadExistingThread({
    threadId
}) {
    return dispatch => {
        dispatch(selectThread(threadId));
        dispatch(updateView(THREAD_VIEW));
    };
}