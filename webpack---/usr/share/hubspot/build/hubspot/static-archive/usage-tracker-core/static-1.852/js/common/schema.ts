import { defaults, isArray, pluck, pick, getRealTypeOf, getObjectKeys, reduceObject } from './helpers';
export const Rules = rules => rules;
export const create = (name, createError, rules, omitExtras = true) => {
  const getKeys = () => getObjectKeys(rules);

  const mutate = callback => {
    const updatedRules = callback(rules);
    return create(name, createError, updatedRules, omitExtras);
  };

  const validate = (subject, caller, onError) => {
    try {
      getKeys().forEach(key => {
        const {
          types,
          oneOf,
          isOptional
        } = rules[key];
        const entry = subject[key];
        const isDefined = entry !== undefined;
        const type = getRealTypeOf(entry);

        if (isOptional) {
          return;
        }

        if (!isDefined) {
          throw createError(`Missing required ${name} "${key}". ${caller} requires that a value be passed for ${name} "${key}". Received "undefined".`);
        }

        if (type !== 'function' && isArray(oneOf) && oneOf.indexOf(entry.toString()) === -1) {
          throw createError(`Invalid ${name}. ${caller} requires that the "${key}" ${name} be one of ["${oneOf.join('", "')}"]. Received "${entry}".`);
        }

        if (isArray(types) && types.indexOf(type) === -1) {
          throw createError(`Invalid ${name}. ${caller} requires that the "${key}" ${name} type be one of ["${types.join('", "')}"]. Received "${type}".`);
        }
      });
    } catch (err) {
      if (onError && typeof onError === 'function') {
        onError(err);
      } else {
        throw err;
      }
    }
  };

  const validateEach = (subject, caller, onError) => {
    try {
      getObjectKeys(subject).forEach(key => {
        const entry = subject[key];
        validate(entry, caller);
      });
    } catch (err) {
      if (onError && typeof onError === 'function') {
        onError(err);
      } else {
        throw err;
      }
    }
  };

  const normalize = subject => {
    const pluckedSubject = pluck('default', rules);
    const withDefaults = defaults(subject, pluckedSubject);

    if (omitExtras) {
      return pick(withDefaults, getKeys());
    }

    return withDefaults;
  };

  const normalizeEach = subject => {
    return reduceObject(subject)((accumulator, key) => {
      const entry = subject[key];
      accumulator[key] = normalize(entry);
      return accumulator;
    });
  };

  return {
    getKeys,
    mutate,
    normalize,
    normalizeEach,
    validate,
    validateEach,
    _peek: () => rules
  };
};