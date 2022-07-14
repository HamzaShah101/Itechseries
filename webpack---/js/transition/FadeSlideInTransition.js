'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import {
    jsx as _jsx
} from "react/jsx-runtime";
import PropTypes from 'prop-types';
import {
    CSSTransition
} from 'react-transition-group';
const duration = 500;

const FadeSlideInTransition = (_ref) => {
    let { in: inProp,
        children,
        direction
    } = _ref,
    rest = _objectWithoutPropertiesLoose(_ref, ["in", "children", "direction"]);

    return /*#__PURE__*/ _jsx(CSSTransition, Object.assign({ in: inProp,
        timeout: duration,
        classNames: `fade-slide-transition-${direction}`,
        mountOnEnter: true,
        unmountOnExit: true,
        appear: true
    }, rest, {
        children: children
    }));
};

FadeSlideInTransition.displayName = 'FadeSlideInTransition';
FadeSlideInTransition.propTypes = {
    children: PropTypes.node.isRequired,
    direction: PropTypes.oneOf(['bottom', 'top']),
    in: PropTypes.bool.isRequired
};
FadeSlideInTransition.defaultProps = {
    direction: 'bottom'
};
export default FadeSlideInTransition;