const LABELS = {
  de: {
    suitable: 'Geeignet',
    unsuitable: 'Nicht geeignet',
    pinkville: 'Männlich',
    greenfield: 'Weiblich',
  },
  en: {
    suitable: 'Suitable',
    unsuitable: 'Not suitable',
    pinkville: 'Male',
    greenfield: 'Female',
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
