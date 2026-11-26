/**
 * Classification helpers for the icon array. Kept free of React and i18n, like
 * calculateMetrics. `invited` follows the app's rule: score >= threshold.
 */

export function classify(score, outcome, threshold) {
  const invited = score >= threshold
  const suitable = outcome === 'suitable'
  if (invited) return suitable ? 'tp' : 'fp'
  return suitable ? 'fn' : 'tn'
}

export function countClasses(rows, threshold) {
  const counts = { tp: 0, fp: 0, fn: 0, tn: 0 }
  for (const row of rows) counts[classify(row.score, row.outcome, threshold)]++
  return counts
}

/**
 * TP, FP, FN, TN — the order of the four blocks in the icon array. Input order is
 * kept within a class, so the figures are stable for a given threshold.
 */
const CLASS_ORDER = ['tp', 'fp', 'fn', 'tn']

export function sortByClass(rows, threshold) {
  return rows
    .map((row, index) => ({
      row,
      index,
      rank: CLASS_ORDER.indexOf(classify(row.score, row.outcome, threshold)),
    }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ row }) => row)
}
