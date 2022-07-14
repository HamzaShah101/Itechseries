import { fromJS } from 'immutable';
import compose from 'transmute/compose';
import getIn from 'transmute/getIn';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { STATUS } from '../constants/keyPaths';
import CommonMesage from '../records/CommonMessage'; // @ts-expect-error module not typed

import { buildAttachments } from './buildAttachments'; // @ts-expect-error module not typed

import { buildStatus } from './buildStatus'; // @ts-expect-error module not typed

import { getId, getTimestamp } from './commonMessageFormatGetters';
import { setAttachments, setId, setStatus, setTimestamp // @ts-expect-error module not typed
} from './commonMessageFormatSetters';
import { setMessageDirection, setRecipients, setSenders // @ts-expect-error module not typed
} from './commonMessageSetters'; // @ts-expect-error module not typed

import { buildRecipients } from './buildRecipients'; // @ts-expect-error module not typed

import { buildSenders } from './buildSenders';
export const buildCommonMessage = (props = {}) => {
  const status = buildStatus(getIn(STATUS, props));
  const attachments = buildAttachments(props.attachments);
  const recipients = buildRecipients(props.recipients);
  const senders = buildSenders(props.senders);
  const messageDirection = props.direction || '';
  const id = getId(props) || generateUuid();
  const timestamp = getTimestamp(props) || generateUniqueClientTimestamp('buildCommonMessage-timestamp');
  return compose(setId(id), setStatus(status), setAttachments(attachments), setTimestamp(timestamp), setRecipients(recipients), setSenders(senders), setMessageDirection(messageDirection))(CommonMesage(fromJS(props)));
};