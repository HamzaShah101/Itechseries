'use es6';

import {
    createAction
} from 'flux-actions';
import {
    getThreadId,
    getLatestReadTimestamp,
    getLatestMessageTimestamp,
    getPreviewMessageId,
    getChannelName
} from '../../threads/operators/threadGetters';
import {
    silenceErrorAlert
} from 'conversations-error-reporting/error-actions/builders/silenceErrorAlert';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    VISITOR
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import {
    markMessageReadByVisitor
} from '../../threads/clients/markMessageReadByVisitor';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
import {
    postClearPageTitleNotification
} from '../../page-title-notifications/actions/post-message/postClearPageTitleNotification';
export const lastSeenSent = createAction(ActionTypes.LAST_SEEN_SENT, ({
    role,
    threadId,
    channel,
    latestMessageTimestamp
}) => ({
    role,
    threadId,
    channel,
    latestMessageTimestamp
}));
export const lastSeenSuccess = createAction(ActionTypes.LAST_SEEN_SUCCESS, ({
    role,
    threadId,
    channel,
    latestMessageTimestamp
}) => ({
    role,
    threadId,
    channel,
    latestMessageTimestamp
}));
export const lastSeenFailure = createAction(ActionTypes.LAST_SEEN_FAILURE, ({
    error
}) => ({
    error
}), silenceErrorAlert);
export function markLastMessageReadByVisitor({
    conversation
}) {
    return (dispatch, getState) => {
        const threadId = getThreadId(conversation);
        const sessionId = getSessionId(getState());
        const latestSentReadTimestamp = getLatestReadTimestamp(conversation);
        const latestMessageTimestamp = getLatestMessageTimestamp(conversation);
        const previewMessageId = getPreviewMessageId(conversation);

        if (latestMessageTimestamp && threadId && sessionId) {
            if (latestMessageTimestamp > latestSentReadTimestamp) {
                const channel = getChannelName(conversation);
                const payload = {
                    role: VISITOR,
                    threadId,
                    channel,
                    latestMessageTimestamp
                };
                dispatch(lastSeenSent(payload));
                markMessageReadByVisitor({
                    messageId: previewMessageId,
                    threadId,
                    sessionId
                }).then(() => {
                    dispatch(lastSeenSuccess(payload));
                    postClearPageTitleNotification();
                }).catch(error => {
                    dispatch(lastSeenFailure({
                        error
                    }));
                }).done();
            }
        }
    };
}