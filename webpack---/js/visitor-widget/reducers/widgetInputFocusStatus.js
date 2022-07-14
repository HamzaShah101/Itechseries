'use es6';

import * as ActionTypes from '../../constants/VisitorActionTypes';
const defaultState = {
    widgetInputIsOnFocus: false
};
export default function widgetInputFocusStatus(state = defaultState, action) {
    switch (action.type) {
        case ActionTypes.USER_INPUT_ON_FOCUS:
            return Object.assign({}, state, {}, action.payload);

        default:
            return state;
    }
}