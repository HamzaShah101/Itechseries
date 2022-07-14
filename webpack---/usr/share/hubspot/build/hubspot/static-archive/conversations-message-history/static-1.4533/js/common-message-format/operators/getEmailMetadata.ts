import get from 'transmute/get';
import { EMAIL_METADATA } from '../constants/attachmentTypes';
import { getAttachments } from './getAttachments';
export const getEmailMetadata = commonMessage => {
  const attachments = getAttachments(commonMessage);

  if (attachments) {
    return attachments.find(attachmentObject => Boolean(attachmentObject && get('@type', attachmentObject) === EMAIL_METADATA));
  }

  return undefined;
};