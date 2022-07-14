'use es6';

import {
    handleActions,
    combineActions
} from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    REFRESH_WIDGET_DATA,
    UPDATE_SESSION_ID
} from '../constants/actionTypes';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import WidgetData from 'conversations-internal-schema/widget-data/records/WidgetData';
import {
    updateAsyncData
} from 'conversations-async-data/async-data/operators/updateAsyncData';
import {
    requestStarted
} from 'conversations-async-data/async-data/operators/requestStarted';
import {
    requestSucceededWithOperator
} from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import {
    setSessionId
} from '../operators/setSessionId';
const initialState = new AsyncData({
    data: new WidgetData()
});
export default handleActions({
    [ActionTypes.GET_WIDGET_DATA]: requestStarted,
    [combineActions(ActionTypes.GET_WIDGET_DATA_SUCCEEDED, REFRESH_WIDGET_DATA)]: (state, action) => requestSucceededWithOperator(() => action.payload, state),
    [UPDATE_SESSION_ID]: (state, action) => {
        const {
            sessionId
        } = action.payload;
        return updateAsyncData(setSessionId(sessionId), state);
    }
    /**
     *
     * Do not mutate values in this reducer. Store state updates in other reducers
     * and use selectors to retrieve values
     *
     */

}, initialState);