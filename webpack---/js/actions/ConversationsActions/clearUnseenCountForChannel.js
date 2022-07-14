'use es6';

import {
    createAction
} from 'flux-actions';
import {
    getThreadByThreadId
} from '../../threads/selectors/getThreadByThreadId';
import {
    calculateUnseenThreadsCount
} from '../../threads/selectors/calculateUnseenThreadsCount';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    postUnreadConversationCountChangedEvent
} from '../../threads/actions/postUnreadConversationCountChangedEvent';
import {
    getUnseenCount
} from '../../threads/operators/threadGetters';
const clearUnseenCountForChannelAction = createAction(ActionTypes.CLEAR_UNSEEN_COUNT_FOR_CHANNEL, ({
    channel,
    threadId
}) => ({
    channel,
    threadId
}));
export const clearUnseenCountForChannel = ({
    channel,
    threadId
}) => (dispatch, getState) => {
    const thread = getThreadByThreadId(getState(), {
        threadId
    });
    const unseenCountForThread = getUnseenCount(thread);

    if (unseenCountForThread > 0) {
        dispatch(clearUnseenCountForChannelAction({
            channel,
            threadId
        }));
        const newUnreadThreadsCount = calculateUnseenThreadsCount(getState());
        postUnreadConversationCountChangedEvent({
            unreadCount: newUnreadThreadsCount
        });
    }
};