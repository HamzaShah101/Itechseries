'use es6';

import {
    getLatestWidgetData
} from '../../widget-data/selectors/getLatestWidgetData';
import {
    getTargetScrollPercentage
} from '../operators/getTargetScrollPercentage';
import {
    executeScrollTrigger
} from '../../client-triggers/actions/executeScrollTrigger';
export const handleScrollPercentageChange = ({
    scrollPercentage
}) => (dispatch, getState) => {
    const widgetData = getLatestWidgetData(getState());

    if (scrollPercentage >= getTargetScrollPercentage(widgetData)) {
        dispatch(executeScrollTrigger());
    }
};