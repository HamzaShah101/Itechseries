'use es6';

import {
    fileAttachmentIdsInMessage
} from 'conversations-message-history/common-message-format/operators/fileAttachmentIdsInMessage';
import {
    getSessionId
} from '../../selectors/widgetDataSelectors/getSessionId';
import {
    resolveAttachments
} from './resolveAttachments';
export const resolveAttachmentsForMessage = ({
    message,
    threadId
}) => (dispatch, getState) => {
    const fileIds = fileAttachmentIdsInMessage(message);

    if (fileIds.size) {
        const sessionId = getSessionId(getState());
        dispatch(resolveAttachments({
            fileIds,
            sessionId,
            threadId
        }));
    }
};