const preferredLanguage = navigator.languages ? navigator.languages[0] : navigator.language;
export const defaultLanguage = preferredLanguage ? preferredLanguage.toLowerCase() : 'en-us';