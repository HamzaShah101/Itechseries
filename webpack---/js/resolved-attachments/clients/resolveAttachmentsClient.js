'use es6';

import noAuthHttp from '../../http/noAuthApiClient';
const RESOLVE_ATTACHMENT_PATH = 'livechat-public/v1/attachment/resolve/thread';
export const resolveAttachmentsClient = ({
    sessionId,
    threadId,
    fileIds
} = {}) => {
    return noAuthHttp.get(`${RESOLVE_ATTACHMENT_PATH}/${threadId}`, {
        query: {
            fileId: fileIds.toArray(),
            sessionId
        }
    });
};