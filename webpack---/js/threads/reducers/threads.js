'use es6';

import {
    Map as ImmutableMap
} from 'immutable';
import {
    handleActions,
    combineActions
} from 'flux-actions';
import set from 'transmute/set';
import get from 'transmute/get';
import merge from 'transmute/merge';
import update from 'transmute/update';
import Raven from 'Raven';
import {
    getData
} from 'conversations-async-data/async-data/operators/getters';
import {
    updateAsyncData
} from 'conversations-async-data/async-data/operators/updateAsyncData';
import {
    requestStarted
} from 'conversations-async-data/async-data/operators/requestStarted';
import {
    requestSucceeded
} from 'conversations-async-data/async-data/operators/requestSucceeded';
import {
    requestSucceededWithOperator
} from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import {
    requestFailed
} from 'conversations-async-data/async-data/operators/requestFailed';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import {
    isConversationalMessage
} from 'conversations-message-history/common-message/operators/isConversationalMessage';
import {
    isEmailCaptureResponseMessage
} from 'conversations-message-history/email-capture-response/operators/isEmailCaptureResponseMessage';
import {
    isCloseThreadMessage
} from 'conversations-message-history/thread-status-update/operators/isCloseThreadMessage';
import {
    isOpenThreadMessage
} from 'conversations-message-history/thread-status-update/operators/isOpenThreadMessage';
import {
    isAssignmentUpdateMessage
} from 'conversations-message-history/assignment-update-message/operators/isAssignmentUpdateMessage';
import {
    getThreadId
} from '../operators/threadGetters';
import {
    setStatus
} from '../operators/setStatus';
import ChatFilterOptions from 'conversations-internal-schema/constants/ChatFilterOptions';
import {
    setLatestReadTimestamp
} from '../operators/setLatestReadTimestamp';
import {
    setLatestMessage
} from '../operators/setLatestMessage';
import {
    setAssignedAgentFromAssignmentMessage
} from '../operators/setAssignedAgentFromAssignmentMessage';
import {
    setCurrentUrl
} from '../operators/setCurrentUrl';
import {
    PUBLISH_MESSAGE
} from '../../pubsub/constants/asyncActionTypes';
import {
    SET_THREADS_SUCCESS,
    UPDATE_THREAD_CURRENT_URL
} from '../constants/actionTypes';
import {
    CREATE_NEW_THREAD
} from '../../thread-create/constants/actionTypes';
import {
    ADD_CONVERSATION,
    RECEIVED_INCOMING_MESSAGE,
    LAST_SEEN_SUCCESS,
    INCREMENT_UNSEEN_COUNT,
    CLEAR_UNSEEN_COUNT_FOR_CHANNEL,
    GET_VISITOR_THREADS_STARTED,
    GET_VISITOR_THREADS_SUCCESS,
    GET_VISITOR_THREADS_FAILURE
} from '../../constants/VisitorActionTypes';
import {
    CHANNEL_CHANGE_RECEIVED
} from '../../pubsub/constants/pubsubActionTypes';
import {
    getNewChannelName
} from 'conversations-internal-pub-sub/channel-change/operators/channelChangeGetters';
import {
    CHANNEL_DETAILS
} from '../constants/KeyPaths';
import {
    setChannelName
} from '../../channel-details/operators/channelDetailsSetters';
const initialState = AsyncData({
    data: ImmutableMap()
});
export function updateLatestMessageAndThreadPreview(message) {
    return thread => {
        thread = setLatestMessage(message, thread);
        return thread;
    };
}
const threadsReducer = handleActions({
    [combineActions(ADD_CONVERSATION, CREATE_NEW_THREAD.SUCCEEDED)]: (state, action) => {
        const {
            conversation
        } = action.payload;
        const threadId = getThreadId(conversation);
        return updateAsyncData(set(threadId, conversation), state);
    },
    [SET_THREADS_SUCCESS]: state => requestSucceeded(state),

    [LAST_SEEN_SUCCESS](state, action) {
        const {
            threadId,
            latestMessageTimestamp
        } = action.payload;
        const data = getData(state);
        const existingThread = get(threadId, data);

        if (!existingThread || !latestMessageTimestamp) {
            return state;
        }

        return updateAsyncData(update(threadId, setLatestReadTimestamp(latestMessageTimestamp)), state);
    },

    [PUBLISH_MESSAGE.SUCCEEDED](state, action) {
        const {
            threadId,
            publishedMessage
        } = action.payload;
        const updateFunc = isConversationalMessage(publishedMessage) && !isEmailCaptureResponseMessage(publishedMessage) ? updateLatestMessageAndThreadPreview : () => thread => thread;
        return updateAsyncData(update(threadId, updateFunc(publishedMessage)), state);
    },

    [RECEIVED_INCOMING_MESSAGE](state, action) {
        const {
            threadId,
            message
        } = action.payload;
        const updateFunc = isConversationalMessage(message) && !isEmailCaptureResponseMessage(message) ? updateLatestMessageAndThreadPreview : () => thread => thread;
        const newState = updateAsyncData(update(threadId, updateFunc(message)), state);

        if (isAssignmentUpdateMessage(message)) {
            return updateAsyncData(update(threadId, setAssignedAgentFromAssignmentMessage(message)), newState);
        }

        if (isCloseThreadMessage(message)) {
            return updateAsyncData(update(threadId, setStatus(ChatFilterOptions.ENDED)), newState);
        }

        if (isOpenThreadMessage(message)) {
            return updateAsyncData(update(threadId, setStatus(ChatFilterOptions.STARTED)), newState);
        }

        return newState;
    },

    [INCREMENT_UNSEEN_COUNT](state, action) {
        const {
            threadId
        } = action.payload;
        return updateAsyncData(update(threadId, update('unseenCount', unseenCount => unseenCount + 1)), state);
    },

    [CLEAR_UNSEEN_COUNT_FOR_CHANNEL](state, action) {
        const {
            threadId
        } = action.payload;
        return updateAsyncData(update(threadId, set('unseenCount', 0)), state);
    },

    [GET_VISITOR_THREADS_STARTED]: state => requestStarted(state),
    [GET_VISITOR_THREADS_SUCCESS]: (state, action) => {
        const {
            threads
        } = action.payload;
        const newThreads = !threads || !threads.length ? ImmutableMap() : threads.reduce((newThreadsMap, newThread) => {
            const threadId = getThreadId(newThread);
            return newThreadsMap.set(threadId, newThread);
        }, ImmutableMap());
        return requestSucceededWithOperator(merge(newThreads), state);
    },
    [GET_VISITOR_THREADS_FAILURE]: state => requestFailed(state),

    [UPDATE_THREAD_CURRENT_URL](state, action) {
        const {
            threadId,
            currentUrl
        } = action.payload;
        return updateAsyncData(threads => {
            return threads.update(threadId, setCurrentUrl(currentUrl));
        }, state);
    },

    [CHANNEL_CHANGE_RECEIVED]: (state, action) => {
        const {
            threadId,
            channelChange
        } = action.payload;
        const newChannelName = getNewChannelName(channelChange);
        return updateAsyncData(data => data.updateIn([threadId, ...CHANNEL_DETAILS], setChannelName(newChannelName)), state);
    }
}, initialState);

const safeReducer = reducer => (state, action) => {
    try {
        return reducer(state, action);
    } catch (e) {
        Raven.captureMessage('THREADS_REDUCER_ERROR', {
            extra: {
                error: e,
                state: state.toJS(),
                action
            }
        });
        return state;
    }
};

export default safeReducer(threadsReducer);