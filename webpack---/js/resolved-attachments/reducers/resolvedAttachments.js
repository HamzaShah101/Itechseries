'use es6';

import {
    handleActions
} from 'flux-actions';
import get from 'transmute/get';
import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import {
    updateEntries
} from 'conversations-async-data/indexed-async-data/operators/updateEntries';
import {
    getEntries
} from 'conversations-async-data/indexed-async-data/operators/getters';
import {
    isSucceeded
} from 'conversations-async-data/async-data/operators/statusComparators';
import {
    updateEntry
} from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import ResolvedAttachmentRecord from 'conversations-internal-schema/resolved-attachment/records/ResolvedAttachmentRecord';
import {
    requestStarted
} from 'conversations-async-data/async-data/operators/requestStarted';
import {
    requestSucceededWithOperator
} from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import {
    requestFailed
} from 'conversations-async-data/async-data/operators/requestFailed';
import {
    RESOLVE_ATTACHMENTS
} from '../constants/resolvedAttachmentsActionTypes';
import {
    FETCH_THREAD_HISTORY
} from '../../thread-histories/constants/ActionTypes';
import {
    ATTACHMENT_UPLOAD_COMPLETE
} from '../../file-uploads/constants/fileUploadsActionTypes';
const initialState = IndexedAsyncData({
    notSetValue: AsyncData({
        data: null
    })
}); // this reducer is the main store for attachments inside a thread view
// fileUploads.js is the store that holds uploads in the file component

const reducer = {
    [RESOLVE_ATTACHMENTS.STARTED](state, action) {
        const {
            requestArgs: {
                fileIds
            }
        } = action.payload;
        const entries = getEntries(state);
        const newFileIds = fileIds.filter(fileId => {
            const entry = entries.get(`${fileId}`);

            if (isSucceeded(entry)) {
                return false;
            }

            return true;
        });
        return updateEntries(newFileIds, (fileId, asyncData) => requestStarted(asyncData), state);
    },

    [RESOLVE_ATTACHMENTS.SUCCEEDED](state, action) {
        const {
            requestArgs: {
                fileIds
            },
            data: resolvedAttachments
        } = action.payload;
        return updateEntries(fileIds, (fileId, asyncData) => {
            return requestSucceededWithOperator(() => {
                const resolvedAttachment = get(fileId, resolvedAttachments);
                return resolvedAttachment;
            }, asyncData);
        }, state);
    },

    [ATTACHMENT_UPLOAD_COMPLETE](state, action) {
        const {
            fileId,
            uploadedFile
        } = action.payload;
        const attachmentRecord = new ResolvedAttachmentRecord({
            fileMetadata: uploadedFile,
            fileId
        });
        return updateEntry(fileId, entry => requestSucceededWithOperator(() => attachmentRecord, entry), state);
    },

    [FETCH_THREAD_HISTORY.SUCCEEDED](state, action) {
        const {
            data: {
                files: resolvedAttachments
            }
        } = action.payload;
        const fileIds = resolvedAttachments.keySeq().toList();
        return updateEntries(fileIds, (fileId, asyncData) => {
            return requestSucceededWithOperator(() => {
                const resolvedAttachment = get(fileId, resolvedAttachments);
                return resolvedAttachment;
            }, asyncData);
        }, state);
    },

    [RESOLVE_ATTACHMENTS.FAILED](state, action) {
        const {
            requestArgs: {
                fileIds
            }
        } = action.payload;
        return updateEntries(fileIds, (fileId, asyncData) => requestFailed(asyncData), state);
    }

};
export default handleActions(reducer, initialState);