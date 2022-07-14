const getObjectKeys = Object.keys;

const promiseHasDone = promise => Boolean(promise && typeof promise.done === 'function');

export { getObjectKeys, promiseHasDone };