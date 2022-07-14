'use es6';

import getIn from 'transmute/getIn';
import {
    FILE_IDS
} from '../constants/fileAttachmentKeyPaths';
export const getFileIds = getIn(FILE_IDS);