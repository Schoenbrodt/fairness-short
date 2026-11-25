const LABELS = {
  de: {
    repays: 'Zahlt zurück',
    defaults: 'Zahlt nicht zurück',
    pinkville: 'Pinklandia',
    greenfield: 'Grünhausen',
  },
  en: {
    repays: 'Repays',
    defaults: 'Does not repay',
    pinkville: 'Pinkville',
    greenfield: 'Greenfield',
  },
}

function labelsFor(lang) {
  return LABELS[lang] ?? LABELS.de
}

export function getOutcomeLabel(outcome, lang) {
  return labelsFor(lang)[outcome] ?? outcome
}

export function getGroupLabel(group, lang) {
  return labelsFor(lang)[group] ?? group
}

/**
 * Adds display labels without changing the canonical `group` / `outcome` keys used by
 * the metrics. Only the charts use the labels.
 */
export function getDisplayData(data, lang) {
  return data.map((row) => ({
    ...row,
    groupLabel: getGroupLabel(row.group, lang),
    outcomeLabel: getOutcomeLabel(row.outcome, lang),
  }))
}
