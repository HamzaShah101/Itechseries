'use es6';

import getIn from 'transmute/getIn';
import {
    createDeprecatedAsyncAction
} from 'conversations-async-data/async-action/createDeprecatedAsyncAction';
import {
    prepareThreadHistoryResponse
} from '../operators/prepareThreadHistoryResponse';
import {
    fetchThreadHistoryClient
} from '../clients/fetchThreadHistoryClient';
import {
    FETCH_THREAD_HISTORY
} from '../constants/ActionTypes';
import {
    getSenderPairs
} from '../operators/getSenderPairs';
import {
    fetchAgentResponderIfNecessary
} from '../../actions/AgentResponderActions';
export const asyncFetchThreadHistory = createDeprecatedAsyncAction({
    requestFn: fetchThreadHistoryClient,
    actionTypes: FETCH_THREAD_HISTORY,
    toRecordFn: prepareThreadHistoryResponse
});
export function fetchThreadHistory({
    offsetOrdinal,
    offsetTimestamp,
    threadId,
    sessionId
}) {
    return dispatch => {
        dispatch(asyncFetchThreadHistory({
            offsetOrdinal,
            offsetTimestamp,
            threadId,
            sessionId
        })).then(({
            payload
        }) => {
            const threadHistory = getIn(['data', 'threadHistory'], payload);
            const responders = getSenderPairs(threadHistory);
            responders.forEach(senderPair => {
                const senderId = getIn(['senderId'], senderPair);
                const senderType = getIn(['senderType'], senderPair);
                dispatch(fetchAgentResponderIfNecessary({
                    senderId,
                    senderType
                }));
            });
        });
    };
}