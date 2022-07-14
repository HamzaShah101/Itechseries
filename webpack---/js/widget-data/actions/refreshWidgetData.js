'use es6';

import {
    createAction
} from 'flux-actions';
import {
    REFRESH_WIDGET_DATA
} from '../constants/actionTypes';
import {
    resetStubbedThread
} from '../../stubbed-thread-history/actions/resetStubbedThread';
import {
    stageInitialMessage
} from '../../actions/PublishActions/stageInitialMessage';
import {
    isCreatingThread
} from '../../thread-create/selectors/stagedThreadSelectors';
import {
    getSelectedThreadId
} from '../../selected-thread/selectors/getSelectedThreadId';
import {
    STUBBED_THREAD_ID
} from '../../threads/constants/stubbedThreadId';
import {
    removeAllClientTriggers
} from '../../client-triggers/actions/removeAllClientTriggers';
import {
    bootstrapInitialWidgetUi
} from '../../initial-message-bubble/actions/bootstrapInitialWidgetUi';
export const refreshWidgetDataAction = createAction(REFRESH_WIDGET_DATA, widgetData => widgetData);
export function refreshWidgetData(widgetData) {
    return (dispatch, getState) => {
        dispatch(refreshWidgetDataAction(widgetData));
        const isStubbedThread = getSelectedThreadId(getState()) === STUBBED_THREAD_ID;
        const isViewingStubbedThread = isStubbedThread && !isCreatingThread(getState());

        if (isViewingStubbedThread) {
            dispatch(resetStubbedThread());
            dispatch(stageInitialMessage());
        }

        dispatch(removeAllClientTriggers());
        dispatch(bootstrapInitialWidgetUi(widgetData));
    };
}