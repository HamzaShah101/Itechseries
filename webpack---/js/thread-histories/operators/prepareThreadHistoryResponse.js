'use es6';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import {
    buildResolvedAttachmentsMapFromResponse
} from '../../resolved-attachments/operators/buildResolvedAttachmentsMapFromResponse';
import {
    buildThreadHistoryFromResponse
} from './buildThreadHistoryFromResponse';
export const prepareThreadHistoryResponse = (_ref) => {
    let {
        attachments,
        hasVisitorEmail
    } = _ref,
    threadHistory = _objectWithoutPropertiesLoose(_ref, ["attachments", "hasVisitorEmail"]);

    return {
        files: buildResolvedAttachmentsMapFromResponse(attachments.files),
        threadHistory: buildThreadHistoryFromResponse(threadHistory),
        hasVisitorEmail
    };
};