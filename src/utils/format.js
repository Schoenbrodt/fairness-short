const LOCALES = { de: 'de-DE', en: 'en-GB' }

export function formatPercent(value, lang) {
  return new Intl.NumberFormat(LOCALES[lang] ?? LOCALES.de, {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value / 100)
}
