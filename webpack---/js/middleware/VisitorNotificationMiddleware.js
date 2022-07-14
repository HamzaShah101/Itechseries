'use es6';

import debounce from 'hs-lodash/debounce';
import {
    notifyBySound
} from '../sound-notifications/notifyBySound';
import {
    isCommonMessageFormat,
    isEmailCMF
} from 'conversations-message-history/common-message-format/operators/cmfComparators';
import * as ActionTypes from '../constants/VisitorActionTypes';
import {
    AGENT,
    BOT
} from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
import {
    getSenderType
} from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
const NOTIFICATION_DEBOUNCE_MS = 2000;

const VisitorNotificationMiddleware = () => {
    const playNotifications = debounce(() => {
        notifyBySound(false);
    }, NOTIFICATION_DEBOUNCE_MS, {
        leading: true,
        trailing: false,
        maxWait: NOTIFICATION_DEBOUNCE_MS
    });

    function isRecipientMessage(message) {
        const from = getSenderType(message);
        return from === AGENT || from === BOT;
    }

    return next => action => {
        switch (action.type) {
            case ActionTypes.RECEIVED_INCOMING_MESSAGE:
                {
                    const {
                        message,
                        shouldNotify
                    } = action.payload;

                    if (shouldNotify && isRecipientMessage(message) && isCommonMessageFormat(message) && !isEmailCMF(message)) {
                        playNotifications();
                    }

                    break;
                }

            case ActionTypes.OPEN_CONVERSATION_FOR_NEW_CHANNEL:
                {
                    const {
                        shouldNotifyBySound
                    } = action.payload;

                    if (shouldNotifyBySound) {
                        playNotifications();
                    }

                    break;
                }

            default:
                break;
        }

        return next(action);
    };
};

export default VisitorNotificationMiddleware;