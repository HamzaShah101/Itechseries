'use es6';

import {
    AGENT_SENDER,
    BOT_SENDER
} from 'conversations-message-history/common-message-format/constants/cmfSenderTypes';
import {
    SENT
} from 'conversations-message-history/common-message-format/constants/statusTypes';
import {
    buildSender
} from 'conversations-message-history/common-message-format/operators/buildSender';
import {
    buildInitialMessage
} from 'conversations-message-history/initial-message/operators/buildInitialMessage';
import {
    generateUniqueClientTimestamp
} from 'conversations-message-history/util/timestamps';
import {
    LIVE_CHAT
} from 'conversations-internal-schema/constants/ThreadSources';
import {
    getUserId
} from 'conversations-internal-schema/responders/operators/responderGetters';
import {
    getInitialResponder
} from '../../responders/selectors/getInitialResponder';
import {
    getIsBot
} from '../../selectors/widgetDataSelectors/getIsBot';
import {
    stageMessageOnStubbedThread
} from '../../stubbed-thread-history/actions/stageMessageOnStubbedThread';
import {
    getFirstMessageText
} from '../../thread-histories/selectors/getFirstMessageText';
import {
    stageSupplementalInitialMessages
} from './stageSupplementalInitialMessages';
import {
    getChannelInstanceId
} from '../../selectors/widgetDataSelectors/getChannelInstanceId';
import {
    buildHubSpotSystemSender
} from 'conversations-message-history/common-message-format/operators/buildHubSpotSystemSender';
import {
    buildContactRecipients
} from 'conversations-message-history/common-message-format/operators/buildCommonMessageRecipients';
import {
    getMessagesUtk
} from '../../query-params/getMessagesUtk';
export function stageInitialMessage() {
    return (dispatch, getState) => {
        const state = getState();
        const isBot = getIsBot(state);
        const responderToUse = getInitialResponder(state);
        const senderId = getUserId(responderToUse);
        const timestamp = generateUniqueClientTimestamp();
        const unpublishedInitialMessage = buildInitialMessage({
            sender: buildSender({
                senderType: isBot ? BOT_SENDER : AGENT_SENDER,
                senderId
            }),
            status: {
                messageStatus: SENT,
                source: LIVE_CHAT,
                timestamp
            },
            richText: getFirstMessageText(state),
            text: getFirstMessageText(state),
            timestamp,
            channelInstanceId: getChannelInstanceId(getState()),
            senders: buildHubSpotSystemSender(),
            recipients: buildContactRecipients({
                vid: getMessagesUtk()
            })
        });
        dispatch(stageMessageOnStubbedThread(unpublishedInitialMessage));

        if (isBot) {
            dispatch(stageSupplementalInitialMessages()).done();
            return;
        }
    };
}