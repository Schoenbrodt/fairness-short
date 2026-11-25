export const LANGS = ['de', 'en']
export const DEFAULT_LANG = 'de'

const STORAGE_KEY = 'fairness.lang'

export function isLang(value) {
  return LANGS.includes(value)
}

export function langFromHash(hash = typeof window === 'undefined' ? '' : window.location.hash) {
  const match = /^#\/(de|en)(?:\/|$)/.exec(hash)
  return match ? match[1] : null
}

export function langFromStorage() {
  if (typeof window === 'undefined') return null
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return isLang(value) ? value : null
  } catch {
    return null
  }
}

export function initialLang() {
  return langFromHash() || langFromStorage() || DEFAULT_LANG
}

export function rememberLang(lang) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Storage can be unavailable (private mode); the URL still carries the language.
  }
}
