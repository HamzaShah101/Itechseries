'use es6';

let _ = t => t,
    _t;

import {
    createGlobalStyle
} from 'styled-components';
import {
    getGlobalTypographyStyles
} from './utils/getGlobalTypographyStyles';
const VizExGlobalStyle = createGlobalStyle(_t || (_t = _ `
  *, ::after, ::before {
    box-sizing: border-box;
  }
  ${0}
`), getGlobalTypographyStyles);
export default VizExGlobalStyle;