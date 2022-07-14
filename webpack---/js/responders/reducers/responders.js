'use es6';

import AsyncData from 'conversations-async-data/async-data/AsyncData';
import {
    requestFailed
} from 'conversations-async-data/async-data/operators/requestFailed';
import {
    requestStarted
} from 'conversations-async-data/async-data/operators/requestStarted';
import {
    requestSucceededWithOperator
} from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import {
    updateEntry
} from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import {
    getSendFrom
} from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import Responder from 'conversations-internal-schema/responders/records/Responder';
import {
    getResponder
} from '../../threads/operators/threadGetters';
import {
    handleActions
} from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    FETCH_AGENT_RESPONDER
} from '../constants/asyncActionTypes';
import {
    buildResponderKeyFromRequest,
    buildResponderKeyFromResponder
} from '../operators/buildResponderKey';
import {
    responderKeyInvariant
} from '../operators/responderKeyInvariant';
const initialState = IndexedAsyncData({
    name: 'responders',
    idInvariant: responderKeyInvariant,
    idTransform: id => id,
    notSetValue: AsyncData({
        data: Responder()
    })
});
export default handleActions({
    [ActionTypes.GET_WIDGET_DATA_SUCCEEDED](responders, action) {
        const {
            payload
        } = action;
        const allResponders = getSendFrom(payload);
        return allResponders.reduce((respondersMap, newResponder) => {
            const id = buildResponderKeyFromResponder(newResponder);
            return updateEntry(id, requestSucceededWithOperator(() => newResponder), respondersMap);
        }, responders);
    },

    [ActionTypes.GET_VISITOR_THREADS_SUCCESS](responders, action) {
        const {
            threads
        } = action.payload;
        const threadResponders = [];
        threads.forEach(thread => {
            const responder = getResponder(thread);

            if (responder) {
                threadResponders.push(responder);
            }
        });
        return threadResponders.reduce((respondersMap, newResponder) => {
            const id = buildResponderKeyFromResponder(newResponder);
            return updateEntry(id, requestSucceededWithOperator(() => newResponder), respondersMap);
        }, responders);
    },

    [FETCH_AGENT_RESPONDER.STARTED](responders, {
        payload
    }) {
        const id = buildResponderKeyFromRequest(payload.requestArgs);
        return updateEntry(id, requestStarted, responders);
    },

    [FETCH_AGENT_RESPONDER.FAILED](responders, {
        payload
    }) {
        const id = buildResponderKeyFromRequest(payload.requestArgs);
        return updateEntry(id, requestFailed, responders);
    },

    [FETCH_AGENT_RESPONDER.SUCCEEDED](responders, {
        payload
    }) {
        const id = buildResponderKeyFromRequest(payload.requestArgs);
        return updateEntry(id, requestSucceededWithOperator(() => payload.data), responders);
    }

}, initialState);