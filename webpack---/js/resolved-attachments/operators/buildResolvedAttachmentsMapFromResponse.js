'use es6';

import reduce from 'transmute/reduce';
import {
    Map as ImmutableMap
} from 'immutable';
import ResolvedAttachmentRecord from 'conversations-internal-schema/resolved-attachment/records/ResolvedAttachmentRecord';
export const buildResolvedAttachmentsMapFromResponse = response => {
    return reduce(ImmutableMap(), (resolvedAttachments, resolvedAttachment = {}, fileIdKey) => {
        const fileId = parseInt(fileIdKey, 10);
        const attachmentRecord = new ResolvedAttachmentRecord(Object.assign({}, resolvedAttachment, {
            fileId
        }));
        return resolvedAttachments.set(fileId, attachmentRecord);
    }, response);
};