export const SUITABLE = 'suitable'
export const UNSUITABLE = 'unsuitable'

/**
 * Counts the four confusion-matrix cells and derives the four teaching metrics.
 * `group` is a canonical group key (`pinkville` / `greenfield`) or `null` for all rows.
 */
export function calculateMetrics(data, group = null, threshold = 50) {
  const rows = group ? data.filter((row) => row.group === group) : data

  let tp = 0
  let fp = 0
  let fn = 0
  let tn = 0

  for (const row of rows) {
    const predictedPositive = row.score >= threshold
    if (row.outcome === SUITABLE) {
      if (predictedPositive) tp += 1
      else fn += 1
    } else if (row.outcome === UNSUITABLE) {
      if (predictedPositive) fp += 1
      else tn += 1
    }
  }

  const total = tp + fp + fn + tn
  // The tiny epsilon keeps half-percentages at the lower integer. The learning material
  // uses these values (e.g. 54.5 % is shown as 54 %), so keep the existing display stable.
  const percent = (numerator, denominator) =>
    Math.round((numerator / (denominator + 1e-9)) * 100)

  return {
    tp,
    fp,
    fn,
    tn,
    total,
    accuracy: percent(tp + tn, total),
    positiveRate: percent(tp + fp, total),
    truePositiveRate: percent(tp, tp + fn),
  }
}

/**
 * Finds the threshold in [min, max] whose `metric` is closest to `target`.
 *
 * Ties are broken by the distance to `reference` (usually the other group's threshold),
 * then by the higher threshold. `exact` says whether the rounded metric equals the target.
 */
export function findThresholdForMetric(
  data,
  group,
  metric,
  target,
  { min = 10, max = 100, reference = null } = {}
) {
  let best = null

  for (let threshold = min; threshold <= max; threshold += 1) {
    const value = calculateMetrics(data, group, threshold)[metric]
    if (typeof value !== 'number') continue

    const diff = Math.abs(value - target)
    const distance = reference == null ? 0 : Math.abs(threshold - reference)

    if (
      best === null ||
      diff < best.diff ||
      (diff === best.diff && distance < best.distance) ||
      (diff === best.diff && distance === best.distance && threshold > best.threshold)
    ) {
      best = { threshold, metricValue: value, diff, distance, exact: diff === 0 }
    }
  }

  if (best === null) {
    return { threshold: reference ?? min, exact: false, metricValue: null }
  }

  return { threshold: best.threshold, exact: best.exact, metricValue: best.metricValue }
}
