'use es6';

import {
    SYSTEM
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import TypicalResponseTimeMessage from 'conversations-message-history/typical-response-time/records/TypicalResponseTimeMessage';
import {
    LIVE_CHAT
} from 'conversations-internal-schema/constants/ThreadSources';
import {
    getAvailabilityTypicalResponseTimeMessage
} from '../../availability/selectors/getAvailabilityTypicalResponseTimeMessage';
import {
    publishMessageToConversation
} from '../../actions/PublishActions/publishMessageToConversation';
import {
    trackInteraction
} from '../../usage-tracking/actions/trackInteraction';
import {
    generateUuid
} from 'conversations-message-history/util/generateUuid';
import {
    SENT
} from 'conversations-message-history/common-message-format/constants/statusTypes';
import {
    LIVE_CHAT_GENERIC_CHANNEL_ID
} from '../../constants/genericChannelId';
import {
    buildHubSpotSystemSender
} from 'conversations-message-history/common-message-format/operators/buildHubSpotSystemSender';
import {
    getChannelInstanceId
} from '../../selectors/widgetDataSelectors/getChannelInstanceId';
export const publishTypicalResponseTimeMessage = ({
    channel,
    threadId
}) => (dispatch, getState) => {
    const senderType = SYSTEM;
    const message = new TypicalResponseTimeMessage({
        id: generateUuid(),
        text: getAvailabilityTypicalResponseTimeMessage(getState()),
        sender: {
            '@type': senderType
        },
        status: {
            source: LIVE_CHAT,
            messageStatus: SENT
        },
        genericChannelId: LIVE_CHAT_GENERIC_CHANNEL_ID,
        channelInstanceId: getChannelInstanceId(getState()),
        senders: buildHubSpotSystemSender()
    });
    dispatch(publishMessageToConversation({
        channel,
        message,
        threadId
    }));
    dispatch(trackInteraction('widget-interaction', {
        action: 'view reply time'
    }));
};