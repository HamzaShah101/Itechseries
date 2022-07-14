'use es6';

import {
    createAction
} from 'flux-actions';
import {
    UPDATE_GLOBAL_COOKIE_OPT_OUT
} from '../constants/ActionTypes';
import {
    updateIsFirstVisitorSession
} from './updateIsFirstVisitorSession';
import {
    localStorageKeys
} from '../../localStorage/constants/storageKeys';
import {
    trackInteraction
} from '../../usage-tracking/actions/trackInteraction';
import {
    getIsPortal53Prod
} from '../../widget-data/operators/getIsPortal53Prod';
export const updateGlobalCookieOptOut = createAction(UPDATE_GLOBAL_COOKIE_OPT_OUT, globalCookieOptOut => ({
    globalCookieOptOut
}));
export const onGlobalCookieOptOut = globalCookieOptOut => dispatch => {
    dispatch(updateGlobalCookieOptOut(globalCookieOptOut));

    if (getIsPortal53Prod() && globalCookieOptOut === 'no') {
        dispatch(updateIsFirstVisitorSession(false));
        dispatch(trackInteraction('pageviewFiftyThree', {
            screen: 'widget',
            subscreen: 'thread view',
            action: 'rendered widget'
        }));
    }

    if (globalCookieOptOut === 'yes') {
        dispatch(updateIsFirstVisitorSession(true));

        try {
            localStorage.removeItem(localStorageKeys.HUBLYTICS_EVENTS_53);
            localStorage.removeItem(localStorageKeys.HMPL);
        } catch (e) {
            return;
        }
    }
};