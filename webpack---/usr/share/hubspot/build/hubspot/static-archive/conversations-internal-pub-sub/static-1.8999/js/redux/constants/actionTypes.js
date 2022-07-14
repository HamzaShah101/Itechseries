'use es6';

import {
    createAsyncActionTypes
} from 'conversations-async-data/async-action/createAsyncActionTypes';
export const INITIALIZE_PUBSUB = createAsyncActionTypes('INITIALIZE_PUBSUB');
export const UPDATE_SUBSCRIPTIONS = createAsyncActionTypes('UPDATE_SUBSCRIPTIONS');
export const RECONNECT = createAsyncActionTypes('RECONNECT');
export const RESUBSCRIBE = createAsyncActionTypes('RESUBSCRIBE');
export const PUBSUB_READY = 'PUBSUB_READY';
export const PUBSUB_RECONNECTED = 'PUBSUB_RECONNECTED';
export const PUBSUB_RECONNECTING = 'PUBSUB_RECONNECTING';
export const PUBSUB_DISCONNECTED = 'PUBSUB_DISCONNECTED';
export const PUBSUB_SUSPENDED = 'PUBSUB_SUSPENDED';