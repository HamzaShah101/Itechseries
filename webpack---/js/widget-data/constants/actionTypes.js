'use es6';

import {
    createAsyncActionTypes
} from 'conversations-async-data/async-action/createAsyncActionTypes';
export const REFRESH_WIDGET_DATA = 'REFRESH_WIDGET_DATA';
export const UPDATE_SESSION_ID = 'UPDATE_SESSION_ID';
export const REFRESH_SESSION_ID = 'REFRESH_SESSION_ID';
export const FETCH_SESSION_ID = createAsyncActionTypes('FETCH_SESSION_ID');