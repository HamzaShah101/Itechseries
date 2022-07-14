export default ((endpoint, data, onScheduleFailure = () => {}) => {
  let scheduled = false;

  try {
    const stringifiedData = new Blob([JSON.stringify(data)], {
      type: 'text/plain'
    });
    scheduled = navigator['sendBeacon'](endpoint, stringifiedData);
  } catch (err) {// We do nothing here if the schedule function gives an error
    // It could happen either because of JSON.stringify or navigator.sendBeacon failing
  }
  /*
   * From w3 beacon spec -
   *
   * The user agent imposes limits on the amount of data that can be sent via this API:
   * this helps ensure that such requests are delivered successfully and with minimal impact
   * on other user and browser activity. If the amount of data to be queued exceeds the user agent limit,
   * this method returns false; a return value of true implies the browser has queued the data for transfer.
   * However, since the actual data transfer happens asynchronously,
   * this method does not provide any information whether the data transfer has succeeded or not.
   */


  if (!scheduled && typeof onScheduleFailure === 'function') {
    onScheduleFailure();
  }

  return scheduled;
});