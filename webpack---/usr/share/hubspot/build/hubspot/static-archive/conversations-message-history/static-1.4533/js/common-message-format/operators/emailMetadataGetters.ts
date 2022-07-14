import getIn from 'transmute/getIn';
import pipe from 'transmute/pipe';
import { BCC, CC, CLIP_STATUS, CONNECTED_ACCOUNT_ADDRESS, FROM, FROM_EMAIL, FROM_NAME, HAS_REPLIES, PREVIOUS_REPLIES_HTML, PREVIOUS_REPLIES_PLAIN_TEXT, SUBJECT, TO, ORIGINAL_SENDER_EMAIL, ORIGINAL_SENDER_NAME, MEMBER_OF_FORWARDED_SUBTHREAD, IS_FORWARD, TEMPLATE_ID, EMAIL_AUTHENTICATION_STATUS } from '../constants/emailMetadataKeypaths';
import { getEmailMetadata } from './getEmailMetadata';
export const getMetadataSubject = getIn(SUBJECT);
export const getSubject = pipe(getEmailMetadata, getMetadataSubject);
export const getMetadataFrom = getIn(FROM);
export const getFrom = pipe(getEmailMetadata, getMetadataFrom);
export const getMetadataFromAddress = getIn(FROM_EMAIL);
export const getFromAddress = pipe(getEmailMetadata, getMetadataFromAddress);
export const getMetadataFromName = getIn(FROM_NAME);
export const getFromName = pipe(getEmailMetadata, getMetadataFromName);
export const getMetadataToAddresses = metadata => {
  const result = getIn(TO, metadata);
  return result ? result.map(email => {
    if (email) {
      return email.trim();
    }

    return email;
  }) : result;
};
export const getToAddresses = pipe(getEmailMetadata, getMetadataToAddresses);
export const getMetadataBCC = getIn(BCC);
export const getBCC = pipe(getEmailMetadata, getMetadataBCC);
export const getMetadataCC = getIn(CC);
export const getCC = pipe(getEmailMetadata, getMetadataCC);
export const getMetadataOriginalSenderEmail = getIn(ORIGINAL_SENDER_EMAIL);
export const getOriginalSenderEmail = pipe(getEmailMetadata, getMetadataOriginalSenderEmail);
export const getMetadataOriginalSenderName = getIn(ORIGINAL_SENDER_NAME);
export const getOriginalSenderName = pipe(getEmailMetadata, getMetadataOriginalSenderName);
export const getMetadataConnectedAccountAddress = getIn(CONNECTED_ACCOUNT_ADDRESS);
export const getConnectedAccountAddress = pipe(getEmailMetadata, getMetadataConnectedAccountAddress);
export const getMetadataHasReplies = getIn(HAS_REPLIES);
export const getHasReplies = pipe(getEmailMetadata, getMetadataHasReplies);
export const getMetadataPreviousRepliesHtml = getIn(PREVIOUS_REPLIES_HTML);
export const getPreviousRepliesHtml = pipe(getEmailMetadata, getMetadataPreviousRepliesHtml);
export const getMetadataPreviousRepliesPlainText = getIn(PREVIOUS_REPLIES_PLAIN_TEXT);
export const getPreviousRepliesPlainText = pipe(getEmailMetadata, getMetadataPreviousRepliesPlainText);
export const getMetadataIsMemberOfForwardedSubthread = getIn(MEMBER_OF_FORWARDED_SUBTHREAD);
export const getIsMemberOfForwardedSubthread = pipe(getEmailMetadata, getMetadataIsMemberOfForwardedSubthread);
export const getMetadataIsForward = getIn(IS_FORWARD);
export const getIsForward = pipe(getEmailMetadata, getMetadataIsForward);
export const getMetadataClipStatus = getIn(CLIP_STATUS);
export const getClipStatus = pipe(getEmailMetadata, getMetadataClipStatus);
export const getMetadataTemplateId = getIn(TEMPLATE_ID);
export const getTemplateId = pipe(getEmailMetadata, getMetadataTemplateId);
export const getMetadataEmailAuthenticationStatus = getIn(EMAIL_AUTHENTICATION_STATUS);
export const getEmailAuthenticationStatus = pipe(getEmailMetadata, getMetadataEmailAuthenticationStatus);