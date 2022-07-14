import { List, Map as ImmutableMap, Record } from 'immutable';
import { COMMON_MESSAGE } from '../constants/messageTypes';
import { SIMPLE } from '../constants/contentTypes';
import { NOT_DELETED } from '../constants/messageDeleteStatus';
import Status from './Status';
const CommonMessage = Record({
  '@type': COMMON_MESSAGE,
  attachments: List(),
  clientType: null,
  contentType: SIMPLE,
  id: null,
  inReplyToId: null,
  messageDeletedStatus: NOT_DELETED,
  richText: '',
  sender: ImmutableMap(),
  status: Status(),
  text: '',
  timestamp: null,
  channelInstanceId: null,
  genericChannelId: null,
  integrationId: null,
  recipients: List(),
  senders: List(),
  direction: ''
}, 'CommonMessage');
export default CommonMessage;