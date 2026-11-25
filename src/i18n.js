import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import de from './locales/de.json'
import en from './locales/en.json'
import { DEFAULT_LANG, LANGS, initialLang, langFromHash, rememberLang } from './lang'

const startLang = initialLang()

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  lng: startLang,
  fallbackLng: DEFAULT_LANG,
  supportedLngs: LANGS,
  interpolation: {
    escapeValue: false,
  },
})

function syncDocument(lang) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = lang
  document.title = i18n.t('app.title')
}

i18n.on('languageChanged', (lang) => {
  rememberLang(lang)
  syncDocument(lang)
})

// Run before React Router handles the hash change, so the next page mounts in the
// language from the URL instead of the previous one.
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    const lang = langFromHash()
    if (lang && lang !== i18n.resolvedLanguage) {
      void i18n.changeLanguage(lang)
    }
  })
}

// The URL wins over the stored choice, and the choice made via the URL is remembered.
rememberLang(startLang)
syncDocument(startLang)

export default i18n
