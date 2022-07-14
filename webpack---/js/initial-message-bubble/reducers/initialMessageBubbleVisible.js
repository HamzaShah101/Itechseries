'use es6';

import {
    handleActions
} from 'flux-actions';
import {
    TOGGLE_INITIAL_MESSAGE_BUBBLE
} from '../constants/initialMessageBubbleActionTypes';
import {
    GET_WIDGET_DATA_SUCCEEDED
} from '../../constants/VisitorActionTypes';
import {
    hasClientTriggers
} from '../../client-triggers/operators/hasClientTriggers';
import {
    getMessage
} from 'conversations-internal-schema/widget-data/operators/widgetDataGetters';
import {
    getPopOpenWelcomeMessage
} from '../operators/getPopOpenWelcomeMessage';
import {
    getPopOpenWidget
} from '../operators/getPopOpenWidget';
const initialState = true;
export default handleActions({
    [TOGGLE_INITIAL_MESSAGE_BUBBLE](state, action) {
        const {
            visible
        } = action.payload;
        return visible;
    },

    [GET_WIDGET_DATA_SUCCEEDED](state, {
        payload
    }) {
        const clientTriggersEnabled = hasClientTriggers(payload);
        const message = getMessage(payload);
        const openWelcomeMessage = getPopOpenWelcomeMessage(message);
        const popOpenWidget = getPopOpenWidget(message);
        if (popOpenWidget && clientTriggersEnabled) return true;
        if (openWelcomeMessage && clientTriggersEnabled) return false;
        return initialState;
    }

}, initialState);