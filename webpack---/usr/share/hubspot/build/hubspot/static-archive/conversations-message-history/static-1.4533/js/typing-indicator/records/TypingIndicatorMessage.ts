import { fromJS, Map as ImmutableMap, Record } from 'immutable';
import { NOT_DELETED } from '../../common-message-format/constants/messageDeleteStatus';
import Status from '../../common-message-format/records/Status';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { TYPING } from '../constants/messageTypes';

class TypingIndicatorMessage extends Record({
  '@type': TYPING,
  id: null,
  timestamp: null,
  echo: false,
  sender: ImmutableMap(),
  messageDeletedStatus: NOT_DELETED,
  clientType: null,
  status: Status()
}, 'TypingIndicatorMessage') {
  constructor(props = {}) {
    const map = fromJS(Object.assign({}, props, {
      id: props.id || generateUuid(),
      timestamp: props.timestamp || generateUniqueClientTimestamp('buildTypingMessage-timestamp')
    })).filterNot(value => typeof value === 'undefined');
    super(map);
  }

}

export default TypingIndicatorMessage;