'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import {
    createAction
} from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import Responder from 'conversations-internal-schema/responders/records/Responder';
import {
    loadExistingThread
} from '../../navigation/actions/loadExistingThread';
import {
    loadStagedThread
} from '../../navigation/actions/loadStagedThread';
import {
    getMostRecentOpenThread
} from '../../threads/selectors/getMostRecentOpenThread';
import {
    fetchVisitorThreads as fetchVisitorThreadsClient
} from '../../threads/clients/fetchVisitorThreads';
import {
    buildThread
} from '../factories/buildThread';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
const getVisitorThreadsStarted = createAction(ActionTypes.GET_VISITOR_THREADS_STARTED);
export const getVisitorThreadsSuccess = createAction(ActionTypes.GET_VISITOR_THREADS_SUCCESS, ({
    threads
}) => {
    const threadMap = threads.map(thread => {
        const {
            responder: responderRaw,
            threadId,
            threadPreview,
            channelDetails
        } = thread,
        others = _objectWithoutPropertiesLoose(thread, ["responder", "threadId", "threadPreview", "channelDetails"]);

        const responder = responderRaw ? Responder(responderRaw) : null;
        return buildThread(Object.assign({
            responder,
            threadId,
            threadPreview,
            channelDetails
        }, others));
    });
    return {
        threads: threadMap
    };
});
export const getVisitorThreadsFailure = createAction(ActionTypes.GET_VISITOR_THREADS_FAILURE, err => err);
export function fetchVisitorThreads() {
    return (dispatch, getState) => {
        dispatch(getVisitorThreadsStarted());
        const sessionId = getSessionId(getState());
        const promise = fetchVisitorThreadsClient({
            sessionId
        }).then(threads => {
            dispatch(getVisitorThreadsSuccess({
                threads
            }));
        }).catch(err => {
            dispatch(getVisitorThreadsFailure(err));
        });
        promise.done();
        return promise;
    };
}
export function navigateToMostRecentThread() {
    return (dispatch, getState) => {
        const recentThread = getMostRecentOpenThread(getState());

        if (recentThread) {
            const {
                threadId,
                channel
            } = recentThread;
            dispatch(loadExistingThread({
                threadId,
                channel
            }));
        } else {
            dispatch(loadStagedThread());
        }
    };
}