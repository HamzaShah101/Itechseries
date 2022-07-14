'use es6';

import {
    createAsyncActionTypes
} from 'conversations-async-data/async-action/createAsyncActionTypes';
export const PUBLISH_MESSAGE = createAsyncActionTypes('PUBLISH_MESSAGE');
export const INITIALIZE_PUBSUB = createAsyncActionTypes('INITIALIZE_PUBSUB');