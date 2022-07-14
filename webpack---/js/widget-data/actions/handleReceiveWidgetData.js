'use es6';

import bootstrapWidget from '../../actions/bootstrapWidget';
import {
    initializeI18n
} from '../../utils/initializeI18n';
import {
    fetchVisitorThreads
} from '../../threads/actions/ThreadActions';
import {
    getShouldFetchInitialVisitorThreads
} from '../../threads/selectors/getShouldFetchInitialVisitorThreads';
import {
    navigateToInitialView
} from '../../navigation/actions/navigateToInitialView';
import {
    setThreadsSuccess
} from '../../threads/actions/setThreadsSuccess';
export const handleReceiveWidgetData = ({
    data
}) => (dispatch, getState) => {
    if (data) {
        return initializeI18n({
            data
        }).then(() => {
            dispatch(bootstrapWidget(data));
            const shouldFetchVisitorThreads = getShouldFetchInitialVisitorThreads(getState());

            if (shouldFetchVisitorThreads) {
                dispatch(fetchVisitorThreads()).then(() => {
                    dispatch(setThreadsSuccess());
                    dispatch(navigateToInitialView());
                });
            } else {
                dispatch(setThreadsSuccess());
                dispatch(navigateToInitialView());
            }
        }, () => {
            dispatch(bootstrapWidget(data));
        });
    }

    return null;
};