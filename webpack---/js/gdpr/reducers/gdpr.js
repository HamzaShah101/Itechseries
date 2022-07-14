'use es6';

import {
    Map as ImmutableMap
} from 'immutable';
import {
    combineActions,
    handleActions
} from 'flux-actions';
import {
    CONSENT_TO_PROCESS_SUCCEEDED,
    CONSENT_TO_PROCESS_FAILED,
    DISMISS_CONSENT_TO_COMMUNICATE_ERROR
} from '../constants/ActionTypes';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import {
    REFRESH_WIDGET_DATA
} from '../../widget-data/constants/actionTypes';
import {
    CREATE_NEW_THREAD
} from '../../thread-create/constants/actionTypes';
import {
    SHOULD_NOT_ASK_FOR_CONSENT
} from 'conversations-internal-schema/widget-data/records/GDPRConsentToProcessStatusTypes';
import {
    getGDPRConsentToProcessStatus
} from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
const initialState = ImmutableMap({
    consentToProcessStatus: SHOULD_NOT_ASK_FOR_CONSENT,
    consentToProcessError: false
});
export default handleActions({
    [ActionTypes.GET_WIDGET_DATA_SUCCEEDED](state, action) {
        const widgetData = action.payload;
        return state.set('consentToProcessStatus', getGDPRConsentToProcessStatus(widgetData));
    },

    [REFRESH_WIDGET_DATA](state, action) {
        const widgetData = action.payload;
        return state.set('consentToProcessStatus', getGDPRConsentToProcessStatus(widgetData));
    },

    [combineActions(CREATE_NEW_THREAD.SUCCEEDED, CONSENT_TO_PROCESS_SUCCEEDED)](state) {
        return state.set('consentToProcessStatus', SHOULD_NOT_ASK_FOR_CONSENT);
    },

    [CONSENT_TO_PROCESS_FAILED](state) {
        return state.set('consentToProcessError', true);
    },

    [DISMISS_CONSENT_TO_COMMUNICATE_ERROR](state) {
        return state.set('consentToProcessError', false);
    }

}, initialState);