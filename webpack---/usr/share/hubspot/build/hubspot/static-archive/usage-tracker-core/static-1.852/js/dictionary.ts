import { between, isArray, mapObject, trim, getObjectKeys, reduceObject } from './common/helpers';
import * as schema from './common/schema';
import { eventError } from './common/messages';
import { eventPropertyTypes, eventDefinitionSchema, eventPropertySchema } from './schemas';

/*
 *  v1.5 of the bender-event-definition-loader package introduced
 *  the concept of "detailed properties" vs "shorthand properties".
 *
 *  For backwards compatibility, this code will adapt any shorthand properties
 *  supported by pre v1.5 loader versions to the detailed property format.
 *  The detailed property format includes additional info such as "isOptional".
 */
const _adaptShorthandProperties = definitions => {
  return reduceObject(definitions)((accumulator, eventKey) => {
    const definition = definitions[eventKey];
    definition.properties = mapObject(definition.properties, (_key, value) => {
      const isShorthandProperty = typeof value === 'string' || isArray(value);

      if (isShorthandProperty) {
        return {
          type: value
        };
      }

      return value;
    });
    definition.properties = eventPropertySchema.normalizeEach(definition.properties);
    accumulator[eventKey] = definition;
    return accumulator;
  });
};
/*
 *  Schemas provide free validation since
 *  an object can be validated against them.
 *
 *  This function takes an event definition,
 *  and generates a schema for it's properties.
 *
 *  EX:
 *
 *    definition = {
 *      name: 'page view',
 *      class: 'view',
 *      properties: {
 *        screen: { type: 'oneOf(["foo", "bar"])', isOptional: false },
 *        subscreen: { type: 'string', isOptional: false }
 *      }
 *    }
 *
 *    schema = {
 *      screen: {
 *        types: ['string'],
 *        oneOf: ['foo', 'bar']
 *      },
 *      subscreen: {
 *        types: ['string']
 *      }
 *    }
 */


export const deriveEventPropertySchema = definition => {
  const properties = definition.properties || {};
  const propertiesBlueprint = getObjectKeys(properties).reduce((accumulator, key) => {
    const {
      type,
      isOptional
    } = properties[key];

    if (typeof type === 'string') {
      if (eventPropertyTypes.indexOf(type) !== -1) {
        accumulator[key] = {
          types: [type],
          isOptional
        };
      } else if (type.indexOf('oneOf') !== -1) {
        const options = between(type, '[', ']').split(',').map(option => trim(trim(option, '"'), "'"));
        accumulator[key] = {
          oneOf: options,
          isOptional
        };
      }
    } else if (isArray(type)) {
      accumulator[key] = {
        oneOf: type,
        isOptional
      };
    }

    return accumulator;
  }, {});
  return schema.create('event property', eventError, propertiesBlueprint, false);
};

const validate = (definition, eventKey, eventProperties) => {
  if (!definition || typeof definition !== 'object') {
    throw eventError(`Invalid event key. The event definition for "${eventKey}" is undefined. Check your events.yaml dictionary.`);
  }

  if (definition) {
    deriveEventPropertySchema(definition).validate(eventProperties, `Event "${eventKey}"`);
  }
};

export const dictionaryLookup = (dictionary, eventKey, eventProperties) => {
  const definition = dictionary[eventKey];
  validate(definition, eventKey, eventProperties);
  return definition;
};
export const createDictionary = (definitions, caller) => {
  const parsedDefinitions = eventDefinitionSchema.normalizeEach(definitions);
  eventDefinitionSchema.validateEach(parsedDefinitions, caller);
  return _adaptShorthandProperties(parsedDefinitions);
};