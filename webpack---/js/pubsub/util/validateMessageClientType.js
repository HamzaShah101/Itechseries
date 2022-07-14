'use es6';

import {
    AGENT_SENDER
} from 'conversations-message-history/common-message-format/constants/cmfSenderTypes';
import {
    getSenderId,
    getSenderTypeForCMF
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
const clientIdRegex = /^AGENT-(\d*)$/;
const API_REPUBLISH = 'API-republish';
export const validateMessageClientType = ({
    message,
    clientId
}) => {
    const senderType = getSenderTypeForCMF(message);

    if (senderType === AGENT_SENDER && clientId !== API_REPUBLISH) {
        const clientIdRegexResult = clientIdRegex.exec(clientId);

        if (!clientIdRegexResult || isNaN(parseInt(clientIdRegexResult[1], 10)) || parseInt(clientIdRegexResult[1], 10) !== getSenderId(message)) {
            throw new Error('malformed message');
        }
    }
};