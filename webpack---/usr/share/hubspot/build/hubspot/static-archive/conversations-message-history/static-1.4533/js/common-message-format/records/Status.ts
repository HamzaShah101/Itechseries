import { Record } from 'immutable';
const Status = Record({
  source: null,
  messageStatus: null,
  timestamp: null,
  sendFailure: null
}, 'Status');
export default Status;