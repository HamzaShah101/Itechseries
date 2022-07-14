'use es6';

import {
    jsx as _jsx
} from "react/jsx-runtime";
import PropTypes from 'prop-types';
import {
    NavMarker
} from 'react-rhumb';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import {
    isSucceeded,
    isFailed
} from 'conversations-async-data/async-data/operators/statusComparators';

const Checker = ({
    startOpen,
    widgetDataAsyncData,
    threadsAsyncData
}) => {
    const requestsToCheck = [widgetDataAsyncData];

    if (startOpen) {
        requestsToCheck.push(threadsAsyncData);
    }

    const anyFailed = requestsToCheck.some(asyncData => isFailed(asyncData));
    const allSucceeded = requestsToCheck.every(asyncData => isSucceeded(asyncData));

    if (anyFailed) {
        return /*#__PURE__*/ _jsx(NavMarker, {
            name: "VISITOR_ERROR"
        });
    } else if (allSucceeded) {
        return /*#__PURE__*/ _jsx(NavMarker, {
            name: "VISITOR_SUCCESS"
        });
    } else {
        return null;
    }
};

Checker.propTypes = {
    startOpen: PropTypes.bool,
    threadsAsyncData: RecordPropType('AsyncData').isRequired,
    widgetDataAsyncData: RecordPropType('AsyncData').isRequired
};
Checker.displayName = 'Checker';
export default Checker;