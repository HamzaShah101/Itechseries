'use es6';

import {
    getQuickReply
} from 'conversations-message-history/common-message-format/operators/cmfQuickReplyGetters';
import {
    getText,
    getRichText
} from 'conversations-message-history/initial-message/operators/initialMessageGetters';
import {
    LIVE_CHAT
} from 'conversations-internal-schema/constants/ThreadSources';
import {
    buildSender
} from 'conversations-message-history/common-message-format/operators/buildSender';
import {
    toCmfSender
} from 'conversations-message-history/common-message-format/operators/cmfSenderInterop';
import {
    BOT_SENDER
} from 'conversations-message-history/common-message-format/constants/cmfSenderTypes';
import QuickReplyAttachment from 'conversations-message-history/common-message-format/records/QuickReplyAttachment';
import {
    NO_CONTENT
} from '../../constants/HttpStatusCodes';
import {
    buildInitialMessage
} from 'conversations-message-history/initial-message/operators/buildInitialMessage';
import {
    generateUniqueClientTimestamp
} from 'conversations-message-history/util/timestamps';
import {
    getUserId
} from 'conversations-internal-schema/responders/operators/responderGetters';
import {
    createAction
} from 'flux-actions';
import {
    getIsWidgetInAwayMode
} from '../../availability/selectors/getIsWidgetInAwayMode';
import {
    fetchSupplementalInitialMessages
} from '../../clients/fetchSupplementalInitialMessages';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    getAssignedResponderInWidget
} from '../../responders/selectors/getAssignedResponderInWidget';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
import {
    stageMessageOnStubbedThread
} from '../../stubbed-thread-history/actions/stageMessageOnStubbedThread';
import {
    getHubspotUtk
} from '../../query-params/hubspotUtk';
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
const fetchSupplementalInitialMessagesStarted = createAction(ActionTypes.GET_SUPPLEMENTAL_INITIAL_MESSAGES);
export const fetchSupplementalInitialMessagesSucceeded = createAction(ActionTypes.GET_SUPPLEMENTAL_INITIAL_MESSAGES_SUCCEEDED);
const fetchSupplementalInitialMessagesFailed = createAction(ActionTypes.GET_SUPPLEMENTAL_INITIAL_MESSAGES_FAILED, error => ({
    error
}));
export function stageSupplementalInitialMessages() {
    return (dispatch, getState) => {
        const state = getState();

        if (getIsWidgetInAwayMode(state)) {
            return Promise.resolve();
        }

        const responder = getAssignedResponderInWidget(state);
        const botId = getUserId(responder);
        const sessionId = getSessionId(state);
        const hubspotUtk = getHubspotUtk();
        dispatch(fetchSupplementalInitialMessagesStarted());
        return fetchSupplementalInitialMessages({
            botId,
            sessionId,
            hubspotUtk
        }).then(response => {
            const messageContainers = response.status === NO_CONTENT ? [] : response.data;
            dispatch(fetchSupplementalInitialMessagesSucceeded());
            messageContainers.forEach(({
                message
            }) => {
                const attachments = [];
                const quickReply = getQuickReply(message);

                if (quickReply) {
                    attachments.push(new QuickReplyAttachment(quickReply));
                }

                const unpublishedInitialMessage = buildInitialMessage({
                    id: message.id,
                    clientType: message.clientType,
                    sender: buildSender({
                        senderType: toCmfSender(message.senderType) || BOT_SENDER,
                        senderId: message.senderId
                    }),
                    status: Object.assign({}, message.status, {
                        source: LIVE_CHAT
                    }),
                    attachments,
                    text: getText(message),
                    richText: getRichText(message),
                    timestamp: generateUniqueClientTimestamp(),
                    channelInstanceId: getChannelInstanceId(getState()),
                    senders: buildHubSpotSystemSender(),
                    recipients: buildContactRecipients({
                        vid: getMessagesUtk()
                    })
                });
                dispatch(stageMessageOnStubbedThread(unpublishedInitialMessage));
            });
        }, error => {
            dispatch(fetchSupplementalInitialMessagesFailed(error));
        });
    };
}