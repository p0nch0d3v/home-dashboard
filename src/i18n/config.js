import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { GetConfigurations } from '../services/ConfigService';

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: 'en',
  lng: (GetConfigurations().language || process.env.REACT_APP_LOCALE_LANG || 'en'),
  resources: {
    en: {
      translations: require('./locales/en/translations.json')
    },
    es: {
      translations: require('./locales/es/translations.json')
    }
  },
  ns: ['translations'],
  defaultNS: 'translations'
});

i18n.languages = ['en', 'es'];

export default i18n;