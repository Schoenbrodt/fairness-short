const translations = {
  en: {
    'Zahlt zurück': 'Repays',
    'Zahlt nicht zurück': 'Does not repay',
    Jung: 'Young',
    Alt: 'Old',
  },
  de: {
    'Zahlt zurück': 'Zahlt zurück',
    'Zahlt nicht zurück': 'Zahlt nicht zurück',
    Jung: 'Jung',
    Alt: 'Alt',
  },
}

export function getTypeLabel(germanLabel, lang) {
  const map = translations[lang] || translations.de
  return map[germanLabel] || germanLabel
}

export function getDisplayData(data, lang) {
  if (lang === 'de') return data
  const map = translations.en
  return data.map((d) => ({
    ...d,
    type: map[d.type] || d.type,
    age: map[d.age] || d.age,
  }))
}
