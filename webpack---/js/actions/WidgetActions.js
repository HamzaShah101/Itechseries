'use es6';

import {
    createAction
} from 'flux-actions';
import {
    getIsOpen
} from '../selectors/getIsOpen';
import * as ActionTypes from '../constants/VisitorActionTypes';
import {
    trackInteraction
} from '../usage-tracking/actions/trackInteraction';
import {
    handleOpenChange
} from '../post-message/handleOpenChange';
export const toggleOpenAction = createAction(ActionTypes.TOGGLE_OPEN, ({
    isOpened,
    isUser
}) => ({
    isOpened,
    isUser: isUser || false
}));
export function toggleOpen({
    isOpened,
    isUser
}) {
    return (dispatch, getState) => {
        if (isOpened !== getIsOpen(getState())) {
            const openActionMessage = isUser ? 'user open widget' : 'system open widget';
            dispatch(trackInteraction('widget-interaction', {
                action: isOpened ? openActionMessage : 'close widget'
            }));
            dispatch(toggleOpenAction({
                isOpened,
                isUser
            }));
            handleOpenChange(isOpened, isUser);
        }
    };
}
export const clickedViralLink = createAction(ActionTypes.CLICK_VIRAL_LINK);