"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const createEnviro = function createEnviro(location) {
  const deployedRe = /^(?!local|test|selenium)(.*\.)?((?:hubspot|hubteam|grader|getsignals|getsidekick|gettally|leadin|hubspotemail|customer-hub|hubspotservicehub)(qa)?\.com|(?:hubspotstarter|hubspotfree)(qa)?\.net|(?:growth)(qa)?\.org)$/;
  const isDeployed = deployedRe.test(location.hostname);
  const qaRe = /(?:hubspot|hubteam|grader|getsignals|getsidekick|gettally|leadin|hubspotemail|customer-hub|hubspotservicehub)qa\.com|(?:hubspotstarter|hubspotfree)qa\.net|(?:growth)qa\.org/;
  const hubletRe = /^(?:api|local|app|private|platform|tools|meetings)-(.*).(?:hubspot|hubteam)(?:qa)?.com/;
  const defaultKey = 'ENV';
  const DEFAULT_NOT_SUPPORTED_ERROR_MSG = 'Enviro error: the default argument for .get and .getShort is no longer supported';

  const getEnv = key => {
    let result = window[key];

    if (result == null) {
      try {
        result = window.sessionStorage.getItem(key);
      } catch (e) {}
    }

    if (result == null) {
      try {
        result = window.localStorage.getItem(key);
      } catch (e) {}
    }

    return result;
  };

  const getDefaultEnv = () => {
    const env = getEnv(defaultKey);

    if (env) {
      return env;
    } else if (qaRe.test(location.host)) {
      return 'qa';
    } else {
      return 'prod';
    }
  };

  const setEnv = (key, env) => {
    window[key] = env;
    return env;
  };

  const MAP = {
    prod: 'production',
    qa: 'development'
  };

  const normalize = env => {
    if (typeof env === 'string') {
      const lower = env.toLowerCase();
      return MAP[lower] || lower;
    }

    return env;
  };

  const denormalize = env => {
    env = typeof env === 'string' ? env.toLowerCase() : undefined;
    return Object.keys(MAP).find(ours => env === MAP[ours]) || env;
  };

  const get = (service, defaultVal) => {
    if (defaultVal != null) {
      throw new Error(DEFAULT_NOT_SUPPORTED_ERROR_MSG);
    }

    let env = null;

    if (service) {
      const parts = service.split('.').reverse();

      for (let i = 0; i < parts.length; i++) {
        const pathPart = parts[i];
        env = getEnv(`${pathPart.toUpperCase()}_ENV`);

        if (env) {
          break;
        }
      }
    }

    if (env == null) {
      const defaultEnv = getDefaultEnv();
      env = defaultEnv != null ? defaultEnv : 'qa';
    }

    return normalize(env);
  };

  const set = function set(key, env) {
    if (arguments.length === 1) {
      env = key;
      key = defaultKey;
    }

    return setEnv(key, env);
  };

  const getInternal = (service, defaultVal) => {
    if (defaultVal != null) {
      throw new Error(DEFAULT_NOT_SUPPORTED_ERROR_MSG);
    }

    return denormalize(get(service));
  };

  const getShort = getInternal;

  const isProd = service => getShort(service) === 'prod';

  const isQa = service => getShort(service) === 'qa';

  const deployed = service => {
    let result;

    if (typeof service === 'string') {
      result = getEnv(`${service.toUpperCase()}_DEPLOYED`);
    }

    if (result == null) {
      result = getEnv('DEPLOYED');
    }

    return result == null ? isDeployed : !!result;
  };

  const debug = (service, defaultVal = false) => {
    let result;

    if (typeof service === 'string') {
      result = getEnv(`${service.toUpperCase()}_DEBUG`);
    }

    if (result == null) {
      result = getEnv('DEBUG');
    }

    return result == null ? defaultVal : result;
  };

  const setDebug = (service, val = true) => {
    if (typeof service === 'string') {
      try {
        if (val) {
          localStorage.setItem(`${service.toUpperCase()}_DEBUG`, JSON.stringify(true));
        } else {
          localStorage.removeItem(`${service.toUpperCase()}_DEBUG`);
        }
      } catch (e) {
        setEnv(`${service.toUpperCase()}_DEBUG`, val || undefined);
      }
    } else {
      val = service != null ? service : true;

      try {
        if (val) {
          localStorage.setItem('DEBUG', JSON.stringify(val));
        } else {
          localStorage.removeItem('DEBUG');
        }
      } catch (e) {
        setEnv('DEBUG', val || undefined);
      }
    }
  };

  const enabled = (service, defaultVal = false) => {
    let result = getEnv(`${service.toUpperCase()}_ENABLED`);

    if (result == null) {
      result = JSON.stringify(defaultVal);
    }

    return `${result}`.toLowerCase() === 'true';
  };

  const getHublet = () => {
    const hubletOverride = getEnv('HUBLET');

    if (hubletOverride) {
      return hubletOverride;
    } else if (hubletRe.test(location.hostname)) {
      return hubletRe.exec(location.hostname)[1];
    }

    return 'na1';
  };

  return {
    createEnviro,
    debug,
    denormalize,
    deployed,
    enabled,
    get,
    getHublet,
    getInternal,
    getShort,
    isProd,
    isQa,
    normalize,
    set,
    setDebug
  };
};

var _default = createEnviro(document.location);

exports.default = _default;
module.exports = exports.default;