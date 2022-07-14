import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useNavMarker from './useNavMarker';

const NavMarkerImpl = ({
  name
}) => {
  useNavMarker(name);
  return null;
};

if (process.env.NODE_ENV !== 'production') {
  NavMarkerImpl.propTypes = {
    name: PropTypes.string.isRequired
  };
}

const NavMarker = ({
  children,
  name,
  active = true
}) => /*#__PURE__*/_jsxs(Fragment, {
  children: [children, active && /*#__PURE__*/_jsx(NavMarkerImpl, {
    name: name
  })]
});

if (process.env.NODE_ENV !== 'production') {
  NavMarker.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
    active: PropTypes.bool
  };
}

export default NavMarker;