'use es6';

import I18n from 'I18n';
import localeMapper from './localeMapper';
import spacename from './spacename';
import {
    initializeI18nMethods
} from './initializeI18nMethods';
initializeI18nMethods(I18n);

if (I18n.isLegacyLoader) {
    console.error('Modules in I18n/init must be used with the new loader. See go/new-i18n');
}

export function createLoader({
    context,
    source,
    mode
}) {
    if (!context) {
        throw new Error('invalid provider source');
    }

    const locales = Object.keys(context);

    function transformModule(mod) {
        if (mod && mod.translations) {
            mod.translations.forEach(t => spacename(I18n.translations, t));
        }

        return mod;
    }

    function loadContext(locale) {
        if (locales.indexOf(locale) < 0) {
            throw new Error(`locale ${locale} does not exist for ${source}`);
        }

        return context[locale]();
    }

    function loadSync(locale) {
        if (mode !== 'sync') {
            throw new Error(`${source} is not sync`);
        }

        return transformModule(loadContext(locale));
    }

    function loadLazy(locale) {
        if (mode !== 'lazy') {
            throw new Error(`${source} is not lazy`);
        }

        return loadContext(locale).then(transformModule).catch(error => setTimeout(() => {
            throw error;
        }, 0));
    }

    function load(allLocales, options = {}) {
        const loadLocalePromises = [];
        const map = options.localeMapper || localeMapper;
        const alreadyLoadedLocales = {};
        allLocales.forEach(locale => {
            const localeToLoad = map(locale, locales);
            const hasLoadedLocale = alreadyLoadedLocales[localeToLoad];

            if (!hasLoadedLocale && localeToLoad && mode === 'lazy') {
                loadLocalePromises.push(loadLazy(localeToLoad));
                alreadyLoadedLocales[localeToLoad] = true;
            } else if (!hasLoadedLocale && localeToLoad) {
                loadLocalePromises.push(Promise.resolve(loadSync(localeToLoad)));
                alreadyLoadedLocales[localeToLoad] = true;
            }
        });
        return Promise.all(loadLocalePromises).catch(error => setTimeout(() => {
            throw error;
        }, 0));
    }

    return {
        mode,
        load,
        locales,
        loadSync,
        loadLazy
    };
}
export function create() {
    let setLocale;
    const intl = {
        langRegistry: {},
        localePromise: new Promise(resolve => setLocale = resolve),

        register(lang, loadOptions = {}) {
            if (this.langRegistry[lang.source]) {
                return Promise.resolve();
            }

            this.langRegistry[lang.source] = lang;
            const provider = createLoader(lang);
            return this.localePromise.then(allLocales => provider.load(loadOptions.getLocales ? loadOptions.getLocales(allLocales) : allLocales, loadOptions)).catch(error => setTimeout(() => {
                throw error;
            }, 0));
        }

    };
    intl.setLocale = setLocale;
    return intl;
}