'use es6';

import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import {
    updateEntry
} from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import {
    requestStateUpdate
} from 'conversations-async-data/async-data/operators/requestStateUpdate';
import {
    requestStartedWithOperator
} from 'conversations-async-data/async-data/operators/requestStartedWithOperator';
import {
    requestSucceededWithOperator
} from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import {
    requestFailedWithError
} from 'conversations-async-data/async-data/operators/requestFailedWithError';
import {
    stringIdInvariant
} from 'conversations-async-data/indexed-async-data/invariants/stringIdInvariant';
import {
    UPDATE_SUBSCRIPTIONS,
    RESUBSCRIBE
} from '../constants/actionTypes';
import {
    RESUBSCRIBING
} from '../constants/states';
const initialState = IndexedAsyncData({
    name: 'subscriptions',
    idInvariant: stringIdInvariant,
    notSetValue: AsyncData({
        data: null
    })
});

const subscriptionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SUBSCRIPTIONS.STARTED:
            {
                const {
                    clientKey,
                    subscriptions
                } = action.payload;
                return updateEntry(clientKey, requestStartedWithOperator(() => subscriptions), state);
            }

        case RESUBSCRIBE.STARTED:
            {
                const {
                    clientKey,
                    subscriptions
                } = action.payload;
                return updateEntry(clientKey, requestStateUpdate(RESUBSCRIBING, () => subscriptions), state);
            }

        case RESUBSCRIBE.SUCCEEDED:
        case UPDATE_SUBSCRIPTIONS.SUCCEEDED:
            {
                const {
                    clientKey,
                    subscriptions
                } = action.payload;
                return updateEntry(clientKey, requestSucceededWithOperator(() => subscriptions), state);
            }

        case RESUBSCRIBE.FAILED:
        case UPDATE_SUBSCRIPTIONS.FAILED:
            {
                const {
                    clientKey,
                    error
                } = action.payload;
                return updateEntry(clientKey, requestFailedWithError(error), state);
            }

        default:
            {
                return state;
            }
    }
};

export const subscriptions = subscriptionsReducer;