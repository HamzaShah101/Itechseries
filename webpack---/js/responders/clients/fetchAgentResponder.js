'use es6';

import PortalIdParser from 'PortalIdParser';
import noAuthHttp from '../../http/noAuthApiClient';
export function fetchAgentResponder({
    senderId,
    agentType,
    sessionId,
    threadId
}) {
    const portalId = PortalIdParser.get();
    return noAuthHttp.get(`livechat-public/v1/responder/${senderId}`, {
        query: {
            agentType,
            portalId,
            sessionId,
            threadId
        }
    });
}