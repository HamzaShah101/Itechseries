'use es6';

import {
    createSelector
} from 'reselect';
import {
    getMessagesPageUri
} from '../../selectors/widgetDataSelectors/getMessagesPageUri';
import {
    buildThread
} from '../../threads/factories/buildThread';
import {
    getInitialMessageText
} from '../../selectors/widgetDataSelectors/getInitialMessageText';
import {
    setLatestMessage
} from '../../threads/operators/setLatestMessage';
import {
    LIVE_CHAT
} from 'conversations-internal-schema/constants/ThreadSources';
import {
    STUBBED_THREAD_ID
} from '../../threads/constants/stubbedThreadId';
import {
    buildCommonMessage
} from 'conversations-message-history/common-message-format/operators/buildCommonMessage';
export const getStubbedThread = createSelector([getMessagesPageUri, getInitialMessageText], (messagesPageUri, initialMessageText) => {
    const latestMessage = buildCommonMessage({
        text: initialMessageText
    });
    const thread = buildThread({
        source: LIVE_CHAT,
        threadId: STUBBED_THREAD_ID,
        currentUrl: messagesPageUri
    });
    return setLatestMessage(latestMessage, thread);
});