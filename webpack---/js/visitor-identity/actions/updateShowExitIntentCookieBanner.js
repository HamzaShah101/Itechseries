'use es6';

import {
    createAction
} from 'flux-actions';
import {
    UPDATE_SHOW_EXIT_INTENT_COOKIE_BANNER
} from '../constants/ActionTypes';
export const updateShowExitIntentCookieBanner = createAction(UPDATE_SHOW_EXIT_INTENT_COOKIE_BANNER, visible => ({
    visible
}));