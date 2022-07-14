'use es6';

import {
    css
} from 'styled-components';
import {
    getGlobalHeadingStyles
} from '../../typography/utils/getHeadingStyles';
import {
    getGlobalLinkStyles
} from '../../link/utils/getLinkStyles';
import {
    getGlobalSmallStyles
} from '../../typography/utils/getSmallStyles';
import {
    getBodyTypographyStyles
} from '../../typography/utils/getBodyTypographyStyles';
export const getGlobalTypographyStyles = css(["body{", "}", " ", " ", ""], getBodyTypographyStyles, getGlobalHeadingStyles, getGlobalLinkStyles, getGlobalSmallStyles);