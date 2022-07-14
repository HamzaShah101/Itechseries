'use es6';

import {
    handleActions
} from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import ClientData from 'conversations-internal-schema/client-data/records/ClientData';
const initialState = ClientData({
    isPubNubClientConnected: true
});
export default handleActions({
    [ActionTypes.APP_IN_FOREGROUND](state) {
        return state.set('isInForeground', true);
    },

    [ActionTypes.APP_IN_BACKGROUND](state) {
        return state.set('isInForeground', false);
    },

    [ActionTypes.NETWORK_ONLINE](state) {
        return state.set('isPubNubClientConnected', true);
    },

    [ActionTypes.NETWORK_OFFLINE](state) {
        return state.set('isPubNubClientConnected', false);
    }

}, initialState);