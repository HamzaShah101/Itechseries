'use es6';

import {
    fromJS,
    List
} from 'immutable';
import reduce from 'transmute/reduce';
import {
    EMAIL_METADATA,
    FILES,
    QUICK_REPLIES,
    INLINE_IMAGES,
    CALL_METADATA,
    MESSAGE_POSITION_DESCRIPTOR,
    LOCATION
} from '../constants/attachmentTypes';
import EmailMetadata from '../records/EmailMetadata';
import FileAttachment from '../records/FileAttachment';
import QuickReplyAttachment from '../records/QuickReplyAttachment';
import InlineImageStatusAttachments from '../records/InlineImageStatusAttachments';
import CallMetadata from '../records/CallMetadata';
import LocationMetadata from '../records/LocationMetadata';
import MessagePositionDescriptor from '../records/MessagePositionDescriptor';
export const buildAttachments = attachments => {
    return reduce(List(), (attachmentList, attachment) => {
        const attachmentType = attachment['@type'];

        switch (attachmentType) {
            case EMAIL_METADATA:
                return attachmentList.push(EmailMetadata(fromJS(attachment)));

            case FILES:
                return attachmentList.push(FileAttachment(fromJS(attachment)));

            case QUICK_REPLIES:
                return attachmentList.push(new QuickReplyAttachment(attachment));

            case INLINE_IMAGES:
                return attachmentList.push(InlineImageStatusAttachments(fromJS(attachment)));

            case CALL_METADATA:
                return attachmentList.push(new CallMetadata(attachment));

            case LOCATION:
                return attachmentList.push(new LocationMetadata(attachment));

            case MESSAGE_POSITION_DESCRIPTOR:
                return attachmentList.push(MessagePositionDescriptor(fromJS(attachment)));

            default:
                return attachmentList;
        }
    }, attachments || List());
};