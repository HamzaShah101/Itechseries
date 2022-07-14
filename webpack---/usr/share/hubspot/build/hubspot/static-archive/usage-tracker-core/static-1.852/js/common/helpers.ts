import enviro from 'enviro';
import { debugKey } from '../storageKeys'; // This defines a local safe reference to the global.Window object
// eslint-disable-next-line

export const lWindow = self;
export const getObjectKeys = Object.keys;
export const promiseHasDone = promise => Boolean(promise && typeof promise.done === 'function'); // @TODO: In the future we want to only support native Promises

export const isPromise = property => property && typeof property === 'object' && typeof property.then === 'function';
export const reduceObject = obj => fn => getObjectKeys(obj).reduce(fn, {});
export const between = (str = '', left = '', right = '') => {
  const leftIndex = str.indexOf(left);
  const rightIndex = str.indexOf(right);
  return str.substr(leftIndex + left.length, rightIndex - leftIndex - right.length);
}; // Note this is a naive approach and should not be used outside this library

export const debounce = (fn, wait) => {
  let timeout = null;
  let result;

  const debounced = (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      result = fn.apply(null, args);
    }, wait);
    return result;
  };

  return debounced;
};
export const defaults = (source = {}, blueprint = {}) => {
  const withDefaults = reduceObject(blueprint)((accumulator, key) => {
    const value = source[key];

    if (value === undefined) {
      accumulator[key] = blueprint[key];
    }

    return accumulator;
  });
  return Object.assign({}, source, {}, withDefaults);
};
export const isArray = thing => {
  if (Array.hasOwnProperty('isArray')) {
    return Array.isArray(thing);
  }

  return Object.prototype.toString.call(thing) === '[object Array]';
};
export const getRealTypeOf = thing => {
  let type = typeof thing;

  if (isArray(thing)) {
    type = 'array';
  }

  return type;
};
export const makeUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let v;
    const r = Math.random() * 16 | 0; // eslint-disable-line no-bitwise

    if (c === 'x') {
      v = r;
    } else {
      v = r & 0x3 | 0x8; // eslint-disable-line no-bitwise
    }

    return v.toString(16);
  });
};
export const mapObject = (source = {}, iteratee) => {
  return reduceObject(source)((accumulator, key) => {
    accumulator[key] = iteratee(key, source[key]);
    return accumulator;
  });
};
export const omit = (source = {}, list = []) => {
  return reduceObject(source)((accumulator, key) => {
    const includes = list.includes(key);

    if (!includes) {
      accumulator[key] = source[key];
    }

    return accumulator;
  });
};
export const pick = (source = {}, list = []) => Object.assign({}, ...list.map(key => ({
  [key]: source[key]
})));
export const once = fn => {
  let isCached;
  let result;
  return (...args) => {
    if (!isCached) {
      isCached = true;
      result = fn(...args);
    }

    return result;
  };
};
export const pluck = (subject, collection) => {
  // We cannot use reduceObject here since the return types are intriniscally different
  return getObjectKeys(collection).reduce((accumulator, key) => {
    const entry = collection[key];
    accumulator[key] = entry[subject];
    return accumulator;
  }, {});
};
export const trim = (str = '', outer = '') => {
  str = str.replace(/^\s+|\s+$/g, '');

  if (str.indexOf(outer) === 0) {
    str = str.substr(outer.length);
  }

  if (str.indexOf(outer) === str.length - outer.length) {
    str = str.substr(0, str.indexOf(outer));
  }

  return str;
};
export const shallowCopy = (source = {}) => {
  return reduceObject(source)((accumulator, key) => {
    accumulator[key] = source[key];
    return accumulator;
  });
};
export const truncate = (str = '', limit = 256) => {
  let truncated = str;

  if (truncated.length > limit) {
    truncated = truncated.substr(0, limit);
    truncated = `${truncated}[..]`;
  }

  return truncated;
};
export const resolveAsyncProperties = (properties = {}, callback, onError) => {
  const resolved = {};
  const propertyKeys = getObjectKeys(properties);
  const propertiesLength = propertyKeys.length;
  const deferred = propertyKeys.reduce((accumulator, key) => {
    let propertyValue = properties[key];

    if (propertyValue && typeof propertyValue === 'function') {
      propertyValue = propertyValue(); // If the function return value is a Promise, we need to wait for it to resolve

      if (isPromise(propertyValue)) {
        accumulator.push({
          key,
          promise: propertyValue
        });
        return accumulator;
      }
    }

    resolved[key] = propertyValue;
    return accumulator;
  }, []);

  const check = () => {
    if (Object.keys(resolved).length === propertiesLength) {
      callback(resolved);
    }
  };

  if (deferred.length) {
    deferred.forEach(({
      key,
      promise
    }) => {
      promise.then(value => {
        resolved[key] = value;
        check();
      }).catch(err => {
        // this is needed since typescript believes that Values could
        // not be assigned to `undefined` which is untrue
        resolved[key] = undefined;

        if (typeof onError === 'function') {
          onError(err);
        }

        check();
      });
    });
  } else {
    callback(resolved);
  }
};
export const createQueue = () => {
  const queue = [];
  return {
    enqueue: entry => queue.unshift(entry),
    dequeue: () => queue.shift(),
    peek: () => queue[0]
  };
};
export const safeGetOrDefault = (path = [], defaultValue = '', // This is a hack to allow a string to be used as index of an object
// That not necessarily contains that index
root = lWindow) => {
  return path.reduce((last, cur, index) => {
    const hasNode = last && cur && typeof last[cur] !== 'undefined';
    const isLeaf = index === path.length - 1;

    if (hasNode) {
      return last[cur];
    }

    if (isLeaf) {
      return defaultValue;
    }

    return {};
  }, root);
};
export const prettyPrint = (str = '') => {
  const snakeCase = str.replace(/(?:^|\.?)([A-Z]+)/g, (x, y) => `_${y.toLowerCase()}`).replace(/^_/, '');
  const titleCase = snakeCase.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  return titleCase.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\s{2}/g, ' ');
};
export const isLocalDeployment = () => !enviro.deployed();
export const isQaDeployment = () => enviro.isQa();
export const isDebugEnabled = () => Boolean(enviro.debug(debugKey));