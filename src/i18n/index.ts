import i18n from 'i18next';
import {I18nContext, initReactI18next} from 'react-i18next';
import en from './en.json';
import hi from './hi.json';
import ma from './ma.json';

// if (!i18n.isInitialized) {
i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    compatibilityJSON: 'v3',
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: en,
      },
      hi: {
        translation: hi,
      },
      ma: {
        translation: ma,
      },
    },
  });
// }
console.log(i18n);

// @TODO: Add logic to change language based on Async storage value
i18n.changeLanguage('en');

export default i18n;