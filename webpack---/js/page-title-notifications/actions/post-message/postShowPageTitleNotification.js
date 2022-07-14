'use es6';

import {
    SHOW_PAGE_TITLE_NOTIFICATION
} from '../../../constants/PostMessageTypes';
import {
    postMessageToParent
} from '../../../post-message/postMessageToParent';
export const postShowPageTitleNotification = () => {
    postMessageToParent(SHOW_PAGE_TITLE_NOTIFICATION);
};