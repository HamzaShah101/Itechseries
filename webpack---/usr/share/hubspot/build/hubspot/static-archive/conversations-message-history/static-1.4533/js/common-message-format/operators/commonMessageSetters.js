'use es6';

import curry from 'transmute/curry';
import get from 'transmute/get';
import setIn from 'transmute/setIn';
import getIn from 'transmute/getIn';
import {
    ATTACHMENTS,
    CHANNEL_INSTANCE_ID,
    GENERIC_CHANNEL_ID,
    INTEGRATION_ID,
    ID,
    MESSAGE_DIRECTION,
    RECIPIENTS,
    RECIPIENT_FIELD,
    SENDERS,
    TEXT,
    RICH_TEXT,
    STATUS,
    TIMESTAMP
} from '../constants/keyPaths';
import {
    getRecipients,
    getAttachments
} from './commonMessageGetters';
/**
 * The modern home of common message operators as we
 * look to get off of ./commonMessageFormatSetters, which
 * has a lot of edge-casing and checks introduced during
 * record migrations.
 */

export const setId = setIn(ID);
export const setText = setIn(TEXT);
export const setTimestamp = setIn(TIMESTAMP);
export const setStatus = setIn(STATUS);
export const setRichText = setIn(RICH_TEXT);
export const setChannelInstanceId = setIn(CHANNEL_INSTANCE_ID);
export const setGenericChannelId = setIn(GENERIC_CHANNEL_ID);
export const setIntegrationId = setIn(INTEGRATION_ID);
export const setMessageDirection = setIn(MESSAGE_DIRECTION);
export const setRecipients = setIn(RECIPIENTS);
export const setSenders = setIn(SENDERS);
export const setAttachments = setIn(ATTACHMENTS);
/* Replace recipients for a field */

export const setRecipientField = curry((field, recipients, commonMessage) => {
    const currentRecipients = getRecipients(commonMessage); // Filter out all the recipients for a field

    const filteredRecipients = currentRecipients.filter(recipient => {
        return getIn(RECIPIENT_FIELD, recipient) !== field;
    }).filter(recipient => getIn(RECIPIENT_FIELD, recipient) !== null); // Add back the new recipiets to the list

    const nextRecipients = filteredRecipients.concat(recipients);
    return setRecipients(nextRecipients, commonMessage);
});
/* Add or replace a attachment based on attachmentType */

export const setAttachment = curry((attachment, commonMessage) => {
    const attachmentType = get('@type', attachment);
    const attachments = getAttachments(commonMessage);
    const filteredAttachments = attachments.filter(attachmentObj => get('@type', attachmentObj) !== attachmentType);
    return setAttachments(filteredAttachments.push(attachment), commonMessage);
});