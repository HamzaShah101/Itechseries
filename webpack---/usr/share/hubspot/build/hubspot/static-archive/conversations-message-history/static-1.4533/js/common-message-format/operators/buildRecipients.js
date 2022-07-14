'use es6';

import {
    fromJS,
    List
} from 'immutable';
import reduce from 'transmute/reduce';
import Recipient from '../records/Recipient';
export const buildRecipients = (recipients = List()) => {
    return reduce(List(), (recipientList, recipient) => {
        return recipientList.push(Recipient(fromJS(recipient)));
    }, recipients);
};