export function calculateMetrics(data, ageGroup, threshold) {
  let filteredData = data
  if (ageGroup !== '') {
    filteredData = data.filter((d) => d.age === ageGroup)
  }

  const grp = filteredData.reduce((acc, item) => {
    const type = item.type
    const score = item.score
    if (!acc[type]) {
      acc[type] = { belowthreshold: 0, abovethreshold: 0 }
    }
    if (score < threshold) {
      acc[type].belowthreshold += 1
    } else {
      acc[type].abovethreshold += 1
    }
    return acc
  }, {})

  const repaysKey = 'Zahlt zurück'
  const notRepaysKey = 'Zahlt nicht zurück'

  const n_true_positive = (grp[repaysKey] && grp[repaysKey].abovethreshold) || 0
  const n_false_positive = (grp[notRepaysKey] && grp[notRepaysKey].abovethreshold) || 0
  const n_false_negative = (grp[repaysKey] && grp[repaysKey].belowthreshold) || 0
  const n_true_negative = (grp[notRepaysKey] && grp[notRepaysKey].belowthreshold) || 0

  const total = n_true_positive + n_false_positive + n_false_negative + n_true_negative

  const eps = 1e-9
  const precision = Math.round(
    ((n_true_positive + eps) / (n_true_positive + n_false_positive + eps)) * 100
  )
  const recall = Math.round(
    (n_true_positive / (n_true_positive + n_false_negative + eps)) * 100
  )
  const accuracy = Math.round(
    ((n_true_positive + n_true_negative) / (total + eps)) * 100
  )
  const positive_rate = Math.round(
    ((n_true_positive + n_false_positive) / (total + eps)) * 100
  )
  const true_positive_rate = recall
  const gewinn = 300 * n_true_positive - 700 * n_false_positive

  return {
    grp,
    n_true_positive,
    n_false_positive,
    n_false_negative,
    n_true_negative,
    total,
    precision,
    recall,
    positive_rate,
    true_positive_rate,
    gewinn,
    accuracy,
  }
}

export function findThresholdForMetric(data, ageGroup, targetMetric, targetValue) {
  let bestThreshold = 0
  let minDiff = Infinity

  for (let t = 0; t <= 100; t++) {
    const metrics = calculateMetrics(data, ageGroup, t)
    const diff = Math.abs(metrics[targetMetric] - targetValue)
    if (diff < minDiff) {
      minDiff = diff
      bestThreshold = t
    }
  }
  return bestThreshold
}
