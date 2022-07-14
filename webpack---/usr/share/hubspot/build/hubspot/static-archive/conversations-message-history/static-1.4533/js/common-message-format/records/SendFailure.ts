import { Record } from 'immutable';
const SendFailure = Record({
  localizedErrorKey: null,
  errorMessage: null,
  errorMessageTokens: null,
  retryable: false
}, 'SendFailure');
export default SendFailure;