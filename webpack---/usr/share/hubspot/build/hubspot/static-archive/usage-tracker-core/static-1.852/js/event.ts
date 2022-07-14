import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import { omit, getObjectKeys, reduceObject } from './common/helpers';
import { eventError } from './common/messages';
import { accountId } from './storageKeys';
const CONDITIONAL_PROPERTIES = {
  what_event_subtype: 'what_event_subtype',
  what_value: 'what_value',
  what_value_str: 'what_value_str',
  where_subscreen2: 'where_subscreen2',
  subscreen2: 'where_subscreen2'
};
const CONDITIONAL_PROPERTY_KEYS = getObjectKeys(CONDITIONAL_PROPERTIES);
const SENSITIVE_PROPERTIES = ['email', 'userId', 'hubId', 'hstc', 'utk', 'deviceId', 'device_id'];
const AUTHED_IDENTIFIER_LABELS = ['USER_ID', 'EMAIL'];
const ANON_IDENTIFIER_LABELS = ['TEMP_ID', 'VISITOR'];

const identifierLabelInList = (userIdentifier = '', list = []) => {
  if (typeof userIdentifier !== 'string') {
    return false;
  }

  return list.indexOf(userIdentifier.split(':')[0]) !== -1;
};

const resolveNamespace = (eventKey, namespaceFromDefinition, namespaceFromProperties) => {
  const namespace = namespaceFromDefinition || namespaceFromProperties;

  if (!namespace || namespace === '*') {
    throw eventError(`Namespace not found for "${eventKey}".`);
  }

  return namespace;
};

export const applyIdentifiers = (identifiers, event) => {
  if (!event.who_email && identifiers.raw.email) {
    event.who_email = identifiers.raw.email;
  }

  if (!event.who_identifier && identifiers.raw.userId) {
    event.who_identifier = identifiers.raw.userId;
  }

  if (!event.who_identifier_v2) {
    event.who_identifier_v2 = identifiers.user;
  }

  if (!event.who_team_identifier) {
    event.who_team_identifier = identifiers.team;
  }

  if (!event.utk) {
    event.utk = identifiers.utk;
  }

  return event;
};
export const normalizeIdentifiers = (identifiers, event) => {
  const currentlyAuthed = identifierLabelInList(identifiers.user, AUTHED_IDENTIFIER_LABELS);
  const previouslyUnauthed = identifierLabelInList(event.who_identifier_v2, ANON_IDENTIFIER_LABELS);
  const previouslyNotSet = event.who_identifier_v2 === '[NOT YET SET, SHOULD GET SET PRIOR TO FLUSH]';

  if (currentlyAuthed && previouslyUnauthed || previouslyNotSet) {
    event.who_identifier_v2 = identifiers.user;
  }

  return applyIdentifiers(identifiers, event);
}; // These Properties may come from events.yaml
// Except from `eventKey` which is defined during `trackEvent`

/* eslint-disable */
export const transformEventPayload = (definition, properties) => {
  const {
    namespace,
    lang,
    screen,
    subscreen,
    timestamp,
    device_id,
    session_id,
    last_sequence_number,
    last_event_id
  } = properties,
        rest = _objectWithoutPropertiesLoose(properties, ["namespace", "lang", "screen", "subscreen", "timestamp", "device_id", "session_id", "last_sequence_number", "last_event_id"]); // Those are the ExtraProperties coming from events.yaml


  const remainingProperties = rest;
  const whatExtraJson = reduceObject(omit(remainingProperties, [...SENSITIVE_PROPERTIES, ...CONDITIONAL_PROPERTY_KEYS]))((accumulator, key) => {
    const value = remainingProperties[key];

    if (value !== null && value !== undefined && value !== '') {
      accumulator[key] = value;
    }

    return accumulator;
  });
  whatExtraJson.locale = lang;
  const payload = {
    hublytics_account_id: accountId,
    where_app: resolveNamespace(rest.eventKey, definition.namespace, namespace),
    where_screen: screen || 'unknown',
    where_subscreen: subscreen || '',
    when_timestamp: timestamp,
    device_id,
    session_id,
    event_id: last_event_id,
    sequence_number: last_sequence_number,
    language: lang,
    what_event: definition.name,
    what_event_class: definition.class.toUpperCase(),
    what_version: definition.version,
    library: {
      name: 'usage-tracker-js',
      version: 1
    },
    what_extra_json: JSON.stringify(whatExtraJson)
  };
  CONDITIONAL_PROPERTY_KEYS.forEach(key => {
    const value = properties[key];

    if (value !== 'undefined') {
      payload[CONDITIONAL_PROPERTIES[key]] = value;
    }
  });
  return payload;
};
export const createEventPayload = (definition, eventProperties, identifiers) => {
  const eventPayload = transformEventPayload(definition, eventProperties);
  return applyIdentifiers(identifiers, eventPayload);
};