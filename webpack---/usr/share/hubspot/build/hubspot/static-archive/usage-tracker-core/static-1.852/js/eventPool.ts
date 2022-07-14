import { createQueue, debounce, isArray } from './common/helpers';
import { storageKey } from './storageKeys';
const PAGE_LOADED_TIME = Date.now();
const PAGE_LOAD_DEFER_TIMER = 6000;
const DEBOUNCE_TIMER = 2000;
const SERIALIZED_ARRAY = JSON.stringify([]);
let hasDeferredExecution = false;
let pageHasLoaded = false;

const getTimeSincePageLoad = () => Date.now() - PAGE_LOADED_TIME;

const shouldDefer = () => {
  if (pageHasLoaded) {
    return false;
  }

  return getTimeSincePageLoad() < PAGE_LOAD_DEFER_TIMER;
};

const execute = callback => callback();

const deferredExecution = callback => {
  if (hasDeferredExecution) {
    return;
  }

  setTimeout(() => {
    execute(callback);
    pageHasLoaded = true;
  }, PAGE_LOAD_DEFER_TIMER - getTimeSincePageLoad());
  hasDeferredExecution = true;
};

const debouncedExecution = debounce(execute, DEBOUNCE_TIMER);
export const scheduleFlush = callback => {
  if (shouldDefer()) {
    deferredExecution(callback);
  } else {
    debouncedExecution(callback);
  }
};
export const createEventPool = ({
  getTempStorage,
  setTempStorage
}) => {
  let isInitialized = false;
  const eventQueue = createQueue();
  return {
    getIsInitialized: () => isInitialized,
    initialize: ({
      normalizeEvent
    }) => {
      try {
        const storedEvents = getTempStorage(storageKey) || SERIALIZED_ARRAY;
        const parsedEvents = JSON.parse(storedEvents);

        if (parsedEvents && isArray(parsedEvents)) {
          parsedEvents.forEach(event => {
            if (event && typeof event === 'object') {
              eventQueue.enqueue(normalizeEvent(event));
            }
          });
        }

        isInitialized = true;
      } catch (err) {
        /* noOp */
      }
    },
    push: event => {
      try {
        const storedEvents = getTempStorage(storageKey) || SERIALIZED_ARRAY;
        const parsedEvents = JSON.parse(storedEvents);
        parsedEvents.push(event);
        setTempStorage(storageKey, JSON.stringify(parsedEvents));
      } catch (err) {
        /* noOp */
      }

      eventQueue.enqueue(event);
    },
    flush: () => {
      const events = [];

      do {
        const event = eventQueue.dequeue();

        if (event) {
          events.unshift(event);
        }
      } while (eventQueue.peek());

      try {
        setTempStorage(storageKey, SERIALIZED_ARRAY);
      } catch (err) {
        /* noOp */
      }

      return events;
    },
    peek: eventQueue.peek
  };
};