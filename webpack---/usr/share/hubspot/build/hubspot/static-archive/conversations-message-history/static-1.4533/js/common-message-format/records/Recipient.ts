import { List, Record } from 'immutable';
const Recipient = Record({
  actorId: '',
  deliveryIdentifier: List(),
  recipientField: null
}, 'Recipient');
export default Recipient;