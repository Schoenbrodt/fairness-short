/**
 * 4/5 check for two selection rates (percentages, 0–100).
 * Returns the ratio of the lower to the higher rate and a traffic-light level.
 * If neither group receives an offer, there is no meaningful ratio.
 */
export function fairnessCheck(rateA, rateB) {
  const high = Math.max(rateA, rateB)
  const low = Math.min(rateA, rateB)

  if (high <= 0) {
    return { level: 'none', ratio: null }
  }

  const ratio = low / high
  const level = ratio >= 0.8 ? 'green' : ratio >= 0.6 ? 'yellow' : 'red'
  return { level, ratio }
}

export function hitRateGap(rateA, rateB) {
  return Math.abs(rateA - rateB)
}
