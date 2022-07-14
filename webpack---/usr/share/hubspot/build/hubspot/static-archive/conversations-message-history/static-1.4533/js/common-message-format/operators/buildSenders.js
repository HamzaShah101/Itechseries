'use es6';

import {
    fromJS,
    List
} from 'immutable';
import reduce from 'transmute/reduce';
import Sender from '../records/Sender';
export const buildSenders = (senders = List()) => {
    return reduce(List(), (senderList, sender) => {
        return senderList.push(Sender(fromJS(sender)));
    }, senders);
};