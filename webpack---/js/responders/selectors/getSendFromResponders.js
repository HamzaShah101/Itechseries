'use es6';

import {
    createSelector
} from 'reselect';
import {
    buildSendFromResponders
} from 'conversations-internal-schema/widget-data/operators/buildSendFromResponders';
import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
export const getSendFromResponders = createSelector([getLatestWidgetData], buildSendFromResponders);