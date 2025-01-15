import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { GetConfigurations } from '../services/ConfigService';
import translationEN from './locales/en/translations.json';
import translationES from './locales/es/translations.json';

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: 'en',
  lng: (GetConfigurations().language || import.meta.env.REACT_APP_LOCALE_LANG || 'en'),
  resources: {
    en: {
      translations: translationEN
    },
    es: {
      translations: translationES
    }
  },
  ns: ['translations'],
  defaultNS: 'translations'
});

i18n.languages = ['en', 'es'];

export default i18n;